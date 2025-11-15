import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOHeadProps {
  url?: string;
  image?: string;
}

const SEOHead = ({ url = "https://whattimeisit.surge.sh/", image = "https://whattimeisit.surge.sh/og-image.png" }: SEOHeadProps) => {
  const { t, i18n } = useTranslation();

  const title = t("seo.title");
  const description = t("seo.description");
  const keywords = t("seo.keywords");
  const ogTitle = t("seo.ogTitle");
  const ogDescription = t("seo.ogDescription");

  // Map i18next language codes to Open Graph locale codes
  const localeMap: Record<string, string> = {
    en: "en_US",
    es: "es_ES",
    it: "it_IT",
    fr: "fr_FR",
    de: "de_DE",
    pt: "pt_BR",
    zh: "zh_CN",
    ja: "ja_JP",
    sim: "en_US", // Fallback for Simlish
  };

  const currentLocale = localeMap[i18n.language] || "en_US";
  const alternateLocales = Object.values(localeMap).filter(
    (locale) => locale !== currentLocale
  );

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={i18n.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="What Time Is It" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={currentLocale} />
      {alternateLocales.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}
      <meta property="og:site_name" content="What Time Is It?" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

export default SEOHead;
