import type { Appearance } from "@clerk/types";

/**
 * Clerk UI komponentleri için Folkie marka teması.
 * Tailwind tema değişkenleri yerine doğrudan HEX kullanıyoruz çünkü
 * Clerk runtime'da CSS değişkenlerini okuyamıyor.
 */
export const folkieClerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#6C3FC5",
    colorText: "#333333",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorDanger: "#E74C3C",
    colorSuccess: "#2ECC71",
    colorWarning: "#F39C12",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    formButtonPrimary:
      "bg-primary hover:bg-primary/90 text-primary-foreground",
    card: "shadow-lg border border-border",
    headerTitle: "text-h3",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButton:
      "border-border hover:bg-primary-light",
  },
};
