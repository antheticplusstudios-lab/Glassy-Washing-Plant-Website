export const SITE_NAME = "Glassy Washing Plant";
export const SITE_DESCRIPTION =
  "Garment washing plant in Bangladesh providing garment washing, denim washing, dyeing, dry process and finishing services in Dhaka.";
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export function seoLinks(pathname: string) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return [
    ...(SITE_URL
      ? [{ rel: "canonical" as const, href: `${SITE_URL}${path}` }]
      : []),
  ];
}

export function publicMeta({
  title,
  description,
  pathname,
}: {
  title: string;
  description: string;
  pathname: string;
}) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { name: "theme-color", content: "#0b5d8f" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:image:alt", content: `${SITE_NAME} logo` },
      { property: "og:locale", content: "en_BD" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: seoLinks(pathname),
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      ...(SITE_URL ? { url: SITE_URL, "@id": `${SITE_URL}/#organization` } : {}),
      logo: SITE_URL ? `${SITE_URL}/logo-mark.png` : "/logo-mark.png",
      description: SITE_DESCRIPTION,
      telephone: "+8801819195026",
      email: "Shahglassy26@gmail.com",
    },
    {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      ...(SITE_URL ? { url: SITE_URL, "@id": `${SITE_URL}/#localbusiness` } : {}),
      image: SITE_URL ? `${SITE_URL}/og-image.jpg` : "/og-image.jpg",
      telephone: "+8801819195026",
      email: "Shahglassy26@gmail.com",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "House 13, Wazuddin Rd, Vatara",
        addressLocality: "Dhaka",
        postalCode: "1212",
        addressCountry: "BD",
      },
      areaServed: {
        "@type": "Country",
        name: "Bangladesh",
      },
      serviceType: [
        "Garment washing",
        "Denim washing",
        "Garment dyeing",
        "Dry process finishing",
        "Whiskering",
        "PP spray",
        "Hand brush",
      ],
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      ...(SITE_URL
        ? {
            url: SITE_URL,
            "@id": `${SITE_URL}/#website`,
            publisher: { "@id": `${SITE_URL}/#organization` },
          }
        : {}),
      inLanguage: "en-BD",
    },
  ],
};
