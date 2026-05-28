import { trTR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

/**
 * Clerk Türkçe yerelleştirmesi + Folkie özel marka metinleri.
 */
export const folkieClerkLocale: LocalizationResource = {
  ...trTR,
  signIn: {
    ...trTR.signIn,
    start: {
      ...trTR.signIn?.start,
      title: "Folkie'ye giriş yap",
      subtitle: "Devam etmek için aşağıdan giriş yap",
    },
  },
  signUp: {
    ...trTR.signUp,
    start: {
      ...trTR.signUp?.start,
      title: "Folkie hesabı oluştur",
      subtitle: "Markaları ve creator'ları buluşturuyoruz",
    },
  },
};
