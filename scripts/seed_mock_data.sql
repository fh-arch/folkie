-- ============================================================
-- Folkie Mock Data Seed
-- Run: docker exec -i folkie-postgres psql -U folkie -d folkie < seed_mock_data.sql
-- ============================================================
-- Covers: Pending Review / Applications / Completed sections
-- Safe to re-run (ON CONFLICT DO NOTHING)
-- ============================================================

BEGIN;

-- ── 0. MOCK BRAND USER + PROFILE ──────────────────────────────
INSERT INTO users (id, clerk_user_id, email, role, full_name, created_at, updated_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'mock_brand_folkie',
  'brand@mock.test',
  2,
  'Folkie Demo Brand',
  NOW(), NOW()
)
ON CONFLICT (clerk_user_id) DO NOTHING;

INSERT INTO brand_profiles (id, user_id, brand_name, industry, website, contact_name, is_verified, is_active, created_at, updated_at)
VALUES (
  'f0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'Folkie Demo Brand',
  'Fashion & Lifestyle',
  'https://folkie.com.tr',
  'Demo Admin',
  true,
  true,
  NOW(), NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- ── 1. FAKE CREATOR USERS ─────────────────────────────────────
INSERT INTO users (id, clerk_user_id, email, role, full_name, created_at, updated_at)
VALUES
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'mock_creator_selin',  'selin@mock.test',  1, 'Selin Yıldız', NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000002'::uuid, 'mock_creator_deniz',  'deniz@mock.test',  1, 'Deniz Kaya',   NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000003'::uuid, 'mock_creator_ece',    'ece@mock.test',    1, 'Ece Şahin',    NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000004'::uuid, 'mock_creator_baran',  'baran@mock.test',  1, 'Baran Demir',  NOW(), NOW())
ON CONFLICT (clerk_user_id) DO NOTHING;

-- ── 2. INFLUENCER PROFILES ────────────────────────────────────
INSERT INTO influencer_profiles (
  id, user_id, tiktok_handle, follower_count, engagement_rate,
  city, categories, content_language, subcategories,
  is_verified, is_active, created_at, updated_at
)
VALUES
  ('b1000000-0000-0000-0000-000000000001'::uuid,
   'a1000000-0000-0000-0000-000000000001'::uuid,
   '@selinyildiz', 8500, 6.20,
   'İstanbul', ARRAY['moda','guzellik'], ARRAY['tr'], ARRAY[]::text[],
   false, true, NOW(), NOW()),

  ('b1000000-0000-0000-0000-000000000002'::uuid,
   'a1000000-0000-0000-0000-000000000002'::uuid,
   '@denizkaya', 4200, 8.10,
   'Ankara', ARRAY['yemek','saglik'], ARRAY['tr'], ARRAY[]::text[],
   false, true, NOW(), NOW()),

  ('b1000000-0000-0000-0000-000000000003'::uuid,
   'a1000000-0000-0000-0000-000000000003'::uuid,
   '@ecesahin', 7300, 5.90,
   'İzmir', ARRAY['teknoloji','eglence'], ARRAY['tr','en'], ARRAY[]::text[],
   true, true, NOW(), NOW()),

  ('b1000000-0000-0000-0000-000000000004'::uuid,
   'a1000000-0000-0000-0000-000000000004'::uuid,
   '@barandemir', 6100, 7.40,
   'Bursa', ARRAY['spor','saglik'], ARRAY['tr'], ARRAY[]::text[],
   false, true, NOW(), NOW())
ON CONFLICT (tiktok_handle) DO NOTHING;

-- ── 3. CAMPAIGNS (linked to the first existing brand) ─────────
-- Campaign A: Active — has pending + approved applications, one submitted content
-- Campaign B: In Progress — approved application with revision_requested
-- Campaign C: Completed — approved applications, content approved/published

DO $$
DECLARE
  v_brand_id UUID;
  v_camp_a   UUID := 'c1000000-0000-0000-0000-000000000001'::uuid;
  v_camp_b   UUID := 'c1000000-0000-0000-0000-000000000002'::uuid;
  v_camp_c   UUID := 'c1000000-0000-0000-0000-000000000003'::uuid;

  v_app_a1   UUID := 'd1000000-0000-0000-0000-000000000001'::uuid; -- camp A, selin  → approved
  v_app_a2   UUID := 'd1000000-0000-0000-0000-000000000002'::uuid; -- camp A, deniz  → pending
  v_app_a3   UUID := 'd1000000-0000-0000-0000-000000000003'::uuid; -- camp A, baran  → pending
  v_app_b1   UUID := 'd1000000-0000-0000-0000-000000000004'::uuid; -- camp B, ece    → approved
  v_app_c1   UUID := 'd1000000-0000-0000-0000-000000000005'::uuid; -- camp C, selin  → approved
  v_app_c2   UUID := 'd1000000-0000-0000-0000-000000000006'::uuid; -- camp C, baran  → approved

  v_sub_a1   UUID := 'e1000000-0000-0000-0000-000000000001'::uuid; -- camp A, selin  → submitted
  v_sub_b1   UUID := 'e1000000-0000-0000-0000-000000000002'::uuid; -- camp B, ece    → revision
  v_sub_c1   UUID := 'e1000000-0000-0000-0000-000000000003'::uuid; -- camp C, selin  → approved
  v_sub_c2   UUID := 'e1000000-0000-0000-0000-000000000004'::uuid; -- camp C, baran  → published
BEGIN
  -- Get first brand profile
  SELECT id INTO v_brand_id FROM brand_profiles LIMIT 1;
  IF v_brand_id IS NULL THEN
    RAISE EXCEPTION 'No brand profile found. Complete onboarding first.';
  END IF;

  -- ── CAMPAIGNS ───────────────────────────────────────────────
  INSERT INTO campaigns (
    id, brand_profile_id, title, product_name, product_category, brief,
    required_hashtags, content_types, tone, target_categories, target_cities,
    content_language, min_followers, max_followers, influencer_count,
    budget_per_influencer, platform_fee_rate, product_delivery, approval_mode,
    application_deadline, publish_start_date, publish_end_date,
    is_flash_campaign, status, created_at, updated_at
  )
  VALUES
    -- Campaign A: Active (status=3)
    (v_camp_a, v_brand_id,
     'Summer Beauty Launch', 'Glow Serum', 'Beauty & Cosmetics',
     'Create a 30-second TikTok video showcasing the Glow Serum morning routine. Show before/after effect. Keep it authentic and relatable.',
     ARRAY['folkiebeauty','glowserum'], ARRAY[1]::integer[], 'authentic',
     ARRAY['guzellik','moda'], ARRAY['İstanbul','İzmir'],
     ARRAY['tr'], 1000, 10000, 5,
     2500.00, 15.0, 1, 2,
     CURRENT_DATE + 10, CURRENT_DATE + 15, CURRENT_DATE + 30,
     false, 3, NOW(), NOW()),

    -- Campaign B: In Progress (status=5)
    (v_camp_b, v_brand_id,
     'Tech Review Series', 'SmartWatch Pro', 'Tech & Gadgets',
     'Unbox and review the SmartWatch Pro in a 45-second video. Highlight fitness tracking and battery life. Use natural lighting.',
     ARRAY['folkietech','smartwatchpro'], ARRAY[1]::integer[], 'professional',
     ARRAY['teknoloji'], ARRAY['Ankara','İstanbul'],
     ARRAY['tr','en'], 1000, 10000, 3,
     3500.00, 15.0, 3, 2,
     CURRENT_DATE - 5, CURRENT_DATE, CURRENT_DATE + 14,
     false, 5, NOW(), NOW()),

    -- Campaign C: Completed (status=6)
    (v_camp_c, v_brand_id,
     'Healthy Snacks Campaign', 'NutriBar', 'Food & Beverage',
     'Share your afternoon snack routine featuring NutriBar. 20-30 seconds, casual and fun. Tag a friend who needs healthier snacks!',
     ARRAY['folkiefood','nutribar','healthysnacks'], ARRAY[1]::integer[], 'fun',
     ARRAY['yemek','saglik'], ARRAY['İstanbul','Bursa','Ankara'],
     ARRAY['tr'], 1000, 10000, 4,
     1800.00, 15.0, 3, 2,
     CURRENT_DATE - 30, CURRENT_DATE - 20, CURRENT_DATE - 5,
     false, 6, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- ── APPLICATIONS ────────────────────────────────────────────
  INSERT INTO campaign_applications (
    id, campaign_id, influencer_profile_id, status,
    applied_at, reviewed_at, created_at, updated_at
  )
  VALUES
    -- Campaign A: 1 approved + 2 pending
    (v_app_a1, v_camp_a, 'b1000000-0000-0000-0000-000000000001'::uuid, 2,
     NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW()),
    (v_app_a2, v_camp_a, 'b1000000-0000-0000-0000-000000000002'::uuid, 1,
     NOW() - INTERVAL '2 days', NULL, NOW() - INTERVAL '2 days', NOW()),
    (v_app_a3, v_camp_a, 'b1000000-0000-0000-0000-000000000004'::uuid, 1,
     NOW() - INTERVAL '1 day', NULL, NOW() - INTERVAL '1 day', NOW()),

    -- Campaign B: 1 approved
    (v_app_b1, v_camp_b, 'b1000000-0000-0000-0000-000000000003'::uuid, 2,
     NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '10 days', NOW()),

    -- Campaign C: 2 approved
    (v_app_c1, v_camp_c, 'b1000000-0000-0000-0000-000000000001'::uuid, 2,
     NOW() - INTERVAL '35 days', NOW() - INTERVAL '32 days', NOW() - INTERVAL '35 days', NOW()),
    (v_app_c2, v_camp_c, 'b1000000-0000-0000-0000-000000000004'::uuid, 2,
     NOW() - INTERVAL '34 days', NOW() - INTERVAL '31 days', NOW() - INTERVAL '34 days', NOW())
  ON CONFLICT (campaign_id, influencer_profile_id) DO NOTHING;

  -- ── CONTENT SUBMISSIONS ──────────────────────────────────────
  INSERT INTO content_submissions (
    id, application_id, video_url, script, hashtags,
    status, revision_note, submitted_at, reviewed_at, created_at, updated_at
  )
  VALUES
    -- Camp A, Selin → submitted (waiting brand review = Pending Review)
    (v_sub_a1, v_app_a1,
     'https://drive.google.com/file/d/mock_selin_beauty_video',
     'Sabah rutinimde artık Glow Serum var! 3 haftadır kullanıyorum, fark inanılmaz.',
     ARRAY['folkiebeauty','glowserum','sabahrutini'],
     1, NULL, NOW() - INTERVAL '12 hours', NULL,
     NOW() - INTERVAL '12 hours', NOW()),

    -- Camp B, Ece → revision_requested
    (v_sub_b1, v_app_b1,
     'https://drive.google.com/file/d/mock_ece_tech_video',
     'SmartWatch Pro unboxing — fitness tracking test yaptım.',
     ARRAY['folkietech','smartwatchpro'],
     2, 'Please show the battery life feature more clearly. Also the lighting is too dark in the second half.',
     NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days',
     NOW() - INTERVAL '5 days', NOW()),

    -- Camp C, Selin → approved (payment pending)
    (v_sub_c1, v_app_c1,
     'https://drive.google.com/file/d/mock_selin_food_video',
     'Sağlıklı atıştırmalık önerim: NutriBar! Arkadaşımı da etiketledim.',
     ARRAY['folkiefood','nutribar','healthysnacks'],
     3, NULL,
     NOW() - INTERVAL '22 days', NOW() - INTERVAL '18 days',
     NOW() - INTERVAL '22 days', NOW()),

    -- Camp C, Baran → published
    (v_sub_c2, v_app_c2,
     NULL,
     'NutriBar ile spor sonrası enerjimi yeniliyorum. Tavsiye ederim!',
     ARRAY['folkiefood','nutribar'],
     4, NULL,
     NOW() - INTERVAL '21 days', NOW() - INTERVAL '17 days',
     NOW() - INTERVAL '21 days', NOW())
  ON CONFLICT (id) DO NOTHING;

END $$;

COMMIT;

-- ── VERIFY ──────────────────────────────────────────────────────
SELECT 'campaigns' AS tbl, count(*) FROM campaigns WHERE id IN (
  'c1000000-0000-0000-0000-000000000001'::uuid,
  'c1000000-0000-0000-0000-000000000002'::uuid,
  'c1000000-0000-0000-0000-000000000003'::uuid
)
UNION ALL
SELECT 'applications', count(*) FROM campaign_applications WHERE id IN (
  'd1000000-0000-0000-0000-000000000001'::uuid,
  'd1000000-0000-0000-0000-000000000002'::uuid,
  'd1000000-0000-0000-0000-000000000003'::uuid,
  'd1000000-0000-0000-0000-000000000004'::uuid,
  'd1000000-0000-0000-0000-000000000005'::uuid,
  'd1000000-0000-0000-0000-000000000006'::uuid
)
UNION ALL
SELECT 'submissions', count(*) FROM content_submissions WHERE id IN (
  'e1000000-0000-0000-0000-000000000001'::uuid,
  'e1000000-0000-0000-0000-000000000002'::uuid,
  'e1000000-0000-0000-0000-000000000003'::uuid,
  'e1000000-0000-0000-0000-000000000004'::uuid
);
