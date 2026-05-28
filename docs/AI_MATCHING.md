# Folkie AI Matching Algorithm — Phased Plan

> Brand ↔ Creator eşleştirmesi için 3 fazlı yol haritası.
> Şu an Faz 1 aktif. Faz 2 sprint 5'te, Faz 3 büyüme sonrası.

---

## Faz 1 — Multi-Factor Weighted Scoring (NOW)

**Where**: `Folkie.Application.Creator.DiscoverCampaigns.DiscoverCampaignsHandler.CalculateMatchScore`

Pure SQL + C# math. No external API, no ML model. Fast (sub-millisecond per pair).

### Score = sum of factors, max 100

| Factor | Weight | How |
|---|---|---|
| **Category match** | 30 | Creator's categories ∩ Campaign's targetCategories. Boost if overlap. |
| **Geography fit** | 15 | Campaign's targetCities contains creator's city (or campaign open to all TR). |
| **Follower range fit** | 25 | Creator's follower count strictly between min/max → full points. Soft penalty just outside. |
| **Engagement rate** | 15 | `engagement_rate ≥ 5% → 15`, `≥ 3% → 10`, else 5. |
| **Reliability (history)** | 10 | Past campaigns completed on time, avg rating ≥ 4.5. (Sprint 6+ — needs review data.) |
| **Content language fit** | 5 | Languages overlap with campaign requirement. |

### Pros / Cons
- ✅ Fast, deterministic, explainable
- ✅ Zero infrastructure
- ❌ No semantic understanding: "moda" creator vs. "stil & lifestyle" campaign → no overlap
- ❌ Doesn't read brief content
- ❌ Doesn't analyze actual TikTok videos

---

## Faz 2 — LLM + Embeddings (Sprint 5-6)

**Hybrid: 60% semantic + 40% rule-based**

### 2a. Embedding-based semantic similarity

**Provider seçimi: Google Gemini** (OpenAI yerine — daha ucuz)

| İş | Model | Maliyet |
|---|---|---|
| Embedding | `text-embedding-004` | **Bedava** (1500 req/dakika limit) |
| Scorer (text) | `gemini-2.0-flash` | $0.10/1M input + $0.40/1M output |
| Multimodal (Faz 3) | `gemini-2.0-flash` (native vision) | Aynı fiyat |

When **brand creates a campaign**:
```csharp
// In CreateCampaignHandler
var embedding = await _gemini.CreateEmbedding(
    text: $"{campaign.Title}\n{campaign.Brief}\nKategoriler: {string.Join(",", campaign.TargetCategories)}",
    model: "text-embedding-004"  // 768-dim
);
campaign.SetSemanticVector(embedding);  // stored in pgvector column
```

When **creator updates profile**:
```csharp
var embedding = await _gemini.CreateEmbedding(
    text: $"{profile.Bio}\n{string.Join(",", profile.Categories)}\n{profile.City}"
);
profile.SetSemanticVector(embedding);
```

When **discovering**:
```sql
-- Postgres pgvector extension (vector dimension: 768 for Gemini)
SELECT id, 1 - (vector <=> campaign_vector) AS similarity
FROM influencer_profiles
WHERE 1 - (vector <=> campaign_vector) > 0.7
ORDER BY similarity DESC
LIMIT 50;
```

Then for **top 50 semantic matches**, run rule-based scoring → combine:
```
final_score = 0.6 * semantic_similarity * 100 + 0.4 * rule_based_score
```

**Cost estimate** (10K creators, 100 campaigns):
- 10K + 100 = 10.1K embeddings × ~200 tokens
- Gemini text-embedding-004: **bedava** (free quota: 1500 RPM, 30K TPM)
- Sadece kotayı aşarsak ücretli plan: $0.025/1M karakter → çok düşük
- Re-embed only when profile/campaign brief changes

### 2b. Gemini 2.0 Flash scorer for top 10

For the top 10 candidates from embedding search, send to Gemini for a personalized reasoning + score:

```csharp
var response = await _gemini.GenerateContent(new {
    model = "gemini-2.0-flash",
    contents = new[] {
        new { role = "user", parts = new[] {
            new { text = """
                Sen Folkie'nin AI eşleştirme algoritmasısın. Bir kampanya brief'i ve
                bir creator profili veriliyor. Şu kriterlere göre 0-100 puan ver ve
                neden uyduğunu/uymadığını 2-3 cümle ile açıkla:
                - Kategori uyumu (creator'ın ilgi alanları vs kampanya ürünü)
                - Hedef kitle (creator'ın takipçi demografisi vs kampanya'nın hedefi)
                - Stil/Ton uyumu (creator'ın bio + son içerik tarzı vs kampanya tonu)
                - Güvenilirlik (engagement oranı, geçmiş işler)
                JSON olarak {"score": int, "reasoning": "..."} dön.
                """ + $"\n\nBRIEF:\n{brief}\n\nCREATOR:\n{profile}" }
        }}
    },
    generationConfig = new { responseMimeType = "application/json" }
});
```

**Cost** (100 campaigns × 10 candidates):
- 1000 prompts × ~1000 input tokens = 1M input
- 1000 × ~150 output = 150K output
- gemini-2.0-flash: $0.10/1M in + $0.40/1M out
- ≈ $0.10 + $0.06 = **$0.16 per 100 campaigns** (GPT-4o-mini'ye göre %33 daha ucuz)

Cache reasoning so we don't re-score the same (brand, creator) pair within 30 days.

### 2c. Brand-side: "Önerilen Creator'lar"

When **brand views campaign**, show top 20 AI-recommended creators (regardless of whether they applied). Brand can **invite** them with one click.

---

## Faz 3 — Content-Aware Matching (Büyüme sonrası, Faz 3 of product)

Add TikTok content analysis layer.

### 3a. Pull last 20 videos per creator (TikTok Business API)

For each video:
- Title, description, hashtags
- View count, like count, comment count
- Posted timestamp
- Thumbnail URL

Store as `tiktok_videos` table.

### 3b. Classify content style with multimodal LLM (Gemini 2.0 Flash native vision)

```csharp
// Gemini supports video frames + thumbnail in one call — no extra cost vs text
var analysis = await _gemini.GenerateContent(new {
    model = "gemini-2.0-flash",
    contents = new[] {
        new { role = "user", parts = new[] {
            new { text = "Bu TikTok video'sunun: 1) İçerik kategorisi (max 3 tag), 2) Tonu (samimi/profesyonel/komik/duygusal/eğitici), 3) Kalite (1-5) ne?" },
            new { fileData = new { mimeType = "image/jpeg", fileUri = video.ThumbnailUrl } }
        }}
    }
});
```

Store per video:
```sql
ALTER TABLE tiktok_videos ADD COLUMN ai_categories text[];
ALTER TABLE tiktok_videos ADD COLUMN ai_tone text;
ALTER TABLE tiktok_videos ADD COLUMN ai_quality_score smallint;
```

Aggregate to creator level:
```sql
CREATE MATERIALIZED VIEW creator_content_profile AS
SELECT
    influencer_profile_id,
    array_agg(DISTINCT category) AS dominant_categories,
    mode() WITHIN GROUP (ORDER BY ai_tone) AS dominant_tone,
    avg(ai_quality_score) AS avg_quality
FROM tiktok_videos JOIN unnest(ai_categories) AS category ON true
GROUP BY influencer_profile_id;
```

### 3c. Bot / fake follower detection

Multiple signals:
- **Engagement ratio**: real accounts have follow:engagement ratio around 5-10%. Bot accounts < 1%.
- **Follower growth curve**: real growth is gradual. Spikes = bought followers.
- **Comment quality**: Gemini 2.0 Flash analyzes last 100 comments — if generic/spam, flag.
- **Account age vs follower count**: 30-day account with 100K followers = suspicious.
- **HypeAuditor API** (optional paid service, ~$30/month): gives audience demographics + bot %.

Store `fake_follower_score` (0-100, lower = better). Show in admin panel; block creators with score > 60.

### 3d. Audience overlap (advanced)

If two creators have very similar audience demographics, brands can target one and use the other as "lookalike". Build a similarity matrix nightly via Hangfire job.

---

## Recommended Sprint Order

| Sprint | Work | Effort |
|---|---|---|
| **Now (Faz 1)** | Improve rule-based scoring (current is basic) | 1 day |
| **Sprint 5** | Add pgvector to PG migration, embedding endpoint, semantic search | 3-5 days |
| **Sprint 6** | Gemini 2.0 Flash scorer for top 10, cache results, show reasoning in UI | 2-3 days |
| **Sprint 7** | Brand-side "AI Önerileri" panel with invite button | 2 days |
| **Faz 3** | TikTok Business API + content analysis + bot detection | 2-3 weeks |

---

## Show It To Users — Transparency

Always show **why** a match score is what it is. On hover:

```
%92 eşleşme
└─ Kategori uyumu      (30/30)
└─ Konum               (15/15)
└─ Takipçi aralığı     (25/25)
└─ Etkileşim oranı     (12/15)
└─ İçerik tonu (AI)    (10/15)
```

This builds trust AND helps creators improve their profiles to get better matches.
