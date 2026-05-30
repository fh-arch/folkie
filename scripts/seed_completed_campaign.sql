-- ============================================================
-- Seed: completed campaign for real brand (Deneme Marka)
-- Run: docker exec -i folkie-postgres psql -U folkie -d folkie < seed_completed_campaign.sql
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_brand_id     UUID;
  v_camp         UUID := 'cc000000-0000-0000-0000-000000000001'::uuid;
  v_app1         UUID := 'cd000000-0000-0000-0000-000000000001'::uuid;
  v_app2         UUID := 'cd000000-0000-0000-0000-000000000002'::uuid;
  v_app3         UUID := 'cd000000-0000-0000-0000-000000000003'::uuid;
  v_sub1         UUID := 'ce000000-0000-0000-0000-000000000001'::uuid;
  v_sub2         UUID := 'ce000000-0000-0000-0000-000000000002'::uuid;
  v_sub3         UUID := 'ce000000-0000-0000-0000-000000000003'::uuid;
  v_pay1         UUID := 'cf000000-0000-0000-0000-000000000001'::uuid;
  v_pay2         UUID := 'cf000000-0000-0000-0000-000000000002'::uuid;
  v_pay3         UUID := 'cf000000-0000-0000-0000-000000000003'::uuid;
BEGIN
  -- Get real brand profile
  SELECT bp.id INTO v_brand_id
  FROM brand_profiles bp
  JOIN users u ON bp.user_id = u.id
  WHERE u.clerk_user_id = 'user_3DgaCLLmIVySMWsOREqPVhLhU7t'
  LIMIT 1;

  IF v_brand_id IS NULL THEN
    RAISE EXCEPTION 'Real brand profile not found.';
  END IF;

  -- Completed campaign
  INSERT INTO campaigns (
    id, brand_profile_id, title, product_name, product_category, brief,
    required_hashtags, content_types, tone, target_categories, target_cities,
    content_language, min_followers, max_followers, influencer_count,
    budget_per_influencer, platform_fee_rate, product_delivery, approval_mode,
    application_deadline, publish_start_date, publish_end_date,
    is_flash_campaign, status, created_at, updated_at
  ) VALUES (
    v_camp, v_brand_id,
    'Spring Skincare Launch', 'GlowBoost Serum', 'Beauty & Cosmetics',
    'Create a 30-second TikTok showcasing your morning skincare routine with GlowBoost Serum. Show before/after glow effect. Keep it natural and authentic.',
    ARRAY['folkiebeauty','glowboost','morningRoutine'], ARRAY[1]::integer[], 'authentic',
    ARRAY['guzellik','saglik'], ARRAY['İstanbul','İzmir'],
    ARRAY['tr'], 1000, 10000, 3,
    2000.00, 15.0, 1, 2,
    CURRENT_DATE - 60, CURRENT_DATE - 45, CURRENT_DATE - 30,
    false, 6, NOW() - INTERVAL '70 days', NOW()
  ) ON CONFLICT (id) DO NOTHING;

  -- 3 approved applications from mock creators
  INSERT INTO campaign_applications (
    id, campaign_id, influencer_profile_id, status,
    applied_at, reviewed_at, created_at, updated_at
  ) VALUES
    (v_app1, v_camp, 'b1000000-0000-0000-0000-000000000001'::uuid, 2,
     NOW() - INTERVAL '65 days', NOW() - INTERVAL '62 days', NOW() - INTERVAL '65 days', NOW()),
    (v_app2, v_camp, 'b1000000-0000-0000-0000-000000000002'::uuid, 2,
     NOW() - INTERVAL '64 days', NOW() - INTERVAL '61 days', NOW() - INTERVAL '64 days', NOW()),
    (v_app3, v_camp, 'b1000000-0000-0000-0000-000000000003'::uuid, 2,
     NOW() - INTERVAL '63 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '63 days', NOW())
  ON CONFLICT (campaign_id, influencer_profile_id) DO NOTHING;

  -- 3 published submissions with TikTok links
  INSERT INTO content_submissions (
    id, application_id, script, hashtags, external_video_url,
    status, submitted_at, reviewed_at, published_at, created_at, updated_at
  ) VALUES
    (v_sub1, v_app1,
     'Sabah rutinimde GlowBoost Serum kullanmaya başladım. 2 haftada fark inanılmaz!',
     ARRAY['folkiebeauty','glowboost','morningRoutine'],
     'https://www.tiktok.com/@selinyildiz/video/7380000000000000001',
     4, NOW() - INTERVAL '50 days', NOW() - INTERVAL '47 days',
     NOW() - INTERVAL '40 days', NOW() - INTERVAL '50 days', NOW()),
    (v_sub2, v_app2,
     'GlowBoost Serum sağlıklı cilt için mükemmel! Tavsiye ederim.',
     ARRAY['folkiebeauty','glowboost'],
     'https://www.tiktok.com/@denizkaya/video/7380000000000000002',
     4, NOW() - INTERVAL '49 days', NOW() - INTERVAL '46 days',
     NOW() - INTERVAL '39 days', NOW() - INTERVAL '49 days', NOW()),
    (v_sub3, v_app3,
     'Cildim için en iyi yatırım. GlowBoost ile tanışın!',
     ARRAY['folkiebeauty','glowboost','skincare'],
     'https://www.tiktok.com/@ecesahin/video/7380000000000000003',
     4, NOW() - INTERVAL '48 days', NOW() - INTERVAL '45 days',
     NOW() - INTERVAL '38 days', NOW() - INTERVAL '48 days', NOW())
  ON CONFLICT (id) DO NOTHING;

  -- 3 transferred payments
  INSERT INTO payments (
    id, campaign_id, influencer_profile_id, amount, payment_type,
    status, iban, iban_name, transfer_reference,
    approved_at, transferred_at, created_at, updated_at
  ) VALUES
    (v_pay1, v_camp, 'b1000000-0000-0000-0000-000000000001'::uuid,
     2000.00, 1, 3,
     'TR330006100519786457841001', 'Selin Yıldız', 'TRF-2026-001',
     NOW() - INTERVAL '35 days', NOW() - INTERVAL '32 days', NOW() - INTERVAL '40 days', NOW()),
    (v_pay2, v_camp, 'b1000000-0000-0000-0000-000000000002'::uuid,
     2000.00, 1, 3,
     'TR330006100519786457841002', 'Deniz Kaya', 'TRF-2026-002',
     NOW() - INTERVAL '35 days', NOW() - INTERVAL '32 days', NOW() - INTERVAL '40 days', NOW()),
    (v_pay3, v_camp, 'b1000000-0000-0000-0000-000000000003'::uuid,
     2000.00, 1, 3,
     'TR330006100519786457841003', 'Ece Şahin', 'TRF-2026-003',
     NOW() - INTERVAL '35 days', NOW() - INTERVAL '32 days', NOW() - INTERVAL '40 days', NOW())
  ON CONFLICT (id) DO NOTHING;

END $$;

COMMIT;

-- Verify
SELECT 'campaign'     AS tbl, count(*)::text AS n FROM campaigns            WHERE id = 'cc000000-0000-0000-0000-000000000001'::uuid
UNION ALL
SELECT 'applications',         count(*)::text      FROM campaign_applications WHERE campaign_id = 'cc000000-0000-0000-0000-000000000001'::uuid
UNION ALL
SELECT 'submissions',          count(*)::text      FROM content_submissions   WHERE application_id IN (SELECT id FROM campaign_applications WHERE campaign_id = 'cc000000-0000-0000-0000-000000000001'::uuid)
UNION ALL
SELECT 'payments',             count(*)::text      FROM payments              WHERE campaign_id = 'cc000000-0000-0000-0000-000000000001'::uuid;
