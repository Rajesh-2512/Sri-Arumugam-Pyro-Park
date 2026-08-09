/**
 * Reusable JSON-LD Structured Data Components for SEO
 * Injects <script type="application/ld+json"> into the page head.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sriarumugampyropark.com";

// ─── LocalBusiness + Organization (For Homepage & Contact Page) ───

interface LocalBusinessJsonLdProps {
  shopName?: string;
  contactNumber?: string;
}

export function LocalBusinessJsonLd({
  shopName = "Sri Arumugam Pyro Park",
  contactNumber = "8682913516",
}: LocalBusinessJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: shopName,
    alternateName: [
      "Sri Arumugam Pyro Park Sivakasi",
      "Arumugam Crackers Sivakasi",
      "SAPP Sivakasi",
    ],
    description:
      "Leading Sivakasi crackers factory outlet — buy Diwali crackers, fireworks, sparklers, flower pots, fancy crackers, sound crackers, rockets, bombs, combo boxes online at direct wholesale prices. Transport across India.",
    url: SITE_URL,
    telephone: `+91${contactNumber}`,
    email: "sriarumugampyropark.svks@gmail.com",
    image: `${SITE_URL}/banner-main.png`,
    logo: `${SITE_URL}/sriarumugamlogo.png`,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Bank Transfer, Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: "4/2017, 56 House Colony, Nalan Crackers Backside",
      addressLocality: "Sivakasi",
      addressRegion: "Tamil Nadu",
      postalCode: "626189",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.4533,
      longitude: 77.7963,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61550216464067",
      "https://x.com/SAPP_SIVAKASI",
      "https://www.instagram.com/sriarumugampyropark/",
      "https://youtube.com/@SriArumugamPyroPark",
    ],
    hasMap:
      "https://www.google.com/maps/place/Sri+Arumugam+Pyro+Park/",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "Sivakasi crackers",
      "Diwali fireworks",
      "Sparklers",
      "Flower pots",
      "Fancy crackers",
      "Sound crackers",
      "Rockets",
      "Bombs",
      "Fireworks combo boxes",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Organization Schema ───

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Sri Arumugam Pyro Park",
    url: SITE_URL,
    logo: `${SITE_URL}/sriarumugamlogo.png`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+918682913516",
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["Tamil", "English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+916374041238",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["Tamil", "English", "Hindi"],
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61550216464067",
      "https://x.com/SAPP_SIVAKASI",
      "https://www.instagram.com/sriarumugampyropark/",
      "https://youtube.com/@SriArumugamPyroPark",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── WebSite Schema with SearchAction (for Google Sitelinks Search Box) ───

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Sri Arumugam Pyro Park",
    alternateName: "SAPP Sivakasi Crackers",
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── BreadcrumbList Schema ───

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Product Schema (For Individual Product Pages) ───

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  price: number;
  slug: string;
  category?: string;
  inStock?: boolean;
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  slug,
  category,
  inStock = true,
}: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: "Sri Arumugam Pyro Park",
    },
    category: category || "Fireworks & Crackers",
    url: `${SITE_URL}/products/${slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: price.toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Sri Arumugam Pyro Park",
      },
      url: `${SITE_URL}/products/${slug}`,
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: new Date(
        new Date().getFullYear(),
        11,
        31
      ).toISOString(),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQPage Schema (For Safety Tips & General FAQ) ───

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQPageJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
