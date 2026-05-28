// Folkie constant lists (form selects and filters)

export const KATEGORILER = [
  { value: "moda", label: "Fashion & Style" },
  { value: "guzellik", label: "Beauty & Cosmetics" },
  { value: "yemek", label: "Food & Kitchen" },
  { value: "spor", label: "Sports & Fitness" },
  { value: "teknoloji", label: "Tech & Gadgets" },
  { value: "seyahat", label: "Travel" },
  { value: "ev", label: "Home & Living" },
  { value: "anne_bebek", label: "Mom & Baby" },
  { value: "egitim", label: "Education" },
  { value: "saglik", label: "Health & Wellness" },
  { value: "egitim_kisisel_gelisim", label: "Personal Development" },
  { value: "eglence", label: "Entertainment" },
  { value: "oyun", label: "Gaming" },
  { value: "muzik_dans", label: "Music & Dance" },
  { value: "iliskiler", label: "Relationships & Family" },
  { value: "is_kariyer", label: "Business & Career" },
  { value: "finans", label: "Finance" },
  { value: "evcil_hayvan", label: "Pets" },
  { value: "sanat", label: "Art & Crafts" },
  { value: "otomotiv", label: "Automotive" },
] as const;

export const ICERIK_TURLERI = [
  { value: "video", label: "Video" },
  { value: "live", label: "Live Stream" },
  { value: "stitch", label: "Stitch" },
  { value: "duet", label: "Duet" },
] as const;

export const TON_SECENEKLERI = [
  { value: "samimi", label: "Authentic" },
  { value: "eglenceli", label: "Fun" },
  { value: "profesyonel", label: "Professional" },
  { value: "komik", label: "Funny" },
  { value: "duygusal", label: "Emotional" },
  { value: "ilham_verici", label: "Inspirational" },
] as const;

export const URUN_TESLIM = [
  { value: "physical", label: "Physical product" },
  { value: "digital", label: "Digital product / coupon" },
  { value: "none", label: "No product" },
] as const;

export const SEHIRLER = [
  "Adana", "Ankara", "Antalya", "Aydın", "Balıkesir", "Bursa", "Çanakkale",
  "Denizli", "Diyarbakır", "Edirne", "Eskişehir", "Gaziantep", "Hatay",
  "İstanbul", "İzmir", "Kayseri", "Kocaeli", "Konya", "Malatya", "Manisa",
  "Mersin", "Muğla", "Sakarya", "Samsun", "Şanlıurfa", "Tekirdağ", "Trabzon",
  "Van",
] as const;

export const KAMPANYA_DURUM_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_payment: "Awaiting payment",
  active: "Active",
  applications_closed: "Applications closed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const BASVURU_DURUM_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const ICERIK_DURUM_LABELS: Record<string, string> = {
  submitted: "Submitted",
  revision_requested: "Revision requested",
  approved: "Approved",
  published: "Published",
};

export const ODEME_DURUM_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  transferred: "Transferred",
  failed: "Failed",
};

export const PLATFORM_FEE_RATE = 15.0; // 15%

// IBAN validation: TR + 24 digits
export const IBAN_REGEX = /^TR\d{24}$/;
