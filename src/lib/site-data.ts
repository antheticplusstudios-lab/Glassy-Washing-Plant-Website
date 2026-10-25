export const company = {
  name: "Glassy Washing Plant",
  phone: "01819195026",
  phoneHref: "tel:+8801819195026",
  whatsapp: "https://wa.me/8801819195026",
  email: "Shahglassy26@gmail.com",
  emailHref: "mailto:Shahglassy26@gmail.com",
  address: "House 13, Wazuddin Rd, Vatara, Dhaka 1212, Bangladesh",
};

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Wash library" },
  { to: "/clients", label: "Who we serve" },
  { to: "/about", label: "The factory" },
  { to: "/contact", label: "Contact" },
] as const;

export const legalLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-service", label: "Terms of Service" },
] as const;

export const stats: [string, string][] = [
  ["10,000+", "sq ft factory"],
  ["100+", "workers"],
  ["$7.5M+", "last-year volume"],
];

export const washes = [
  {
    id: "01",
    title: "Garment washing & stone wash",
    copy: "Industrial washing and controlled stone abrasion create the requested denim shade, texture and worn-in character.",
    image: "/images/v2/wash-stone.jpg",
    tags: ["Stone Wash", "Medium Stone Wash", "Dark Stone Wash", "Light Stone Wash", "Stone Enzyme Wash", "Acid Wash", "Rubber Ball Wash"],
  },
  {
    id: "02",
    title: "Enzyme, bleach & softening",
    copy: "Wet-process treatments soften the garment surface and lighten colour to match the approved wash standard.",
    image: "/images/v2/wash-dye.jpg",
    tags: ["Bleach Wash", "Enzyme Wash", "Enzyme Bleach Wash", "Silicon Wash", "Critical & Normal Garments Wash"],
  },
  {
    id: "03",
    title: "Dyeing & colour effects",
    copy: "Dye and overdye processes add or adjust garment colour; shade samples should be approved before bulk production.",
    image: "/images/v2/swatches.jpg",
    tags: ["Overdye Wash", "Pigment Wash", "Deep Dye", "Tint Wash", "Custom Wash Standard"],
  },
  {
    id: "04",
    title: "Dry process & hand finishing",
    copy: "Operators create localised wear and design details with grinding, scraping, PP spray, whiskering and hand brushing.",
    image: "/images/v2/wash-handwork.jpg",
    tags: ["Grinding", "Scraping", "PP Spray (Potassium Permanganate)", "Whisker Effects", "Hand Brush"],
  },
];

export const specialties = [
  "Bleach Wash",
  "Enzyme Wash",
  "Stone Wash",
  "Enzyme Bleach Wash",
  "Silicon Wash",
  "Medium Stone Wash",
  "Dark Stone Wash",
  "Light Stone Wash",
  "Stone Enzyme Wash",
  "Overdye Wash",
  "Pigment Wash",
  "Acid Wash",
  "Grinding",
  "Scraping",
  "PP Spray (Potassium Permanganate)",
  "Deep Dye",
  "Tint Wash",
  "Rubber Ball Wash",
  "Whisker Effects",
  "Hand Brush",
  "Critical & Normal Garments Wash",
  "Custom Wash Standard",
];

export type ServiceItem = {
  id: string;
  title: string;
  /** Homepage carousel artwork. */
  image: string;
  /** Real photo from the plant floor, used on the Wash Library page. */
  photo: string;
  /** One-line plain-English description of the finish. */
  detail: string;
};

function service(id: string, title: string, file: string, detail: string): ServiceItem {
  return {
    id,
    title,
    image: file === "drying-unit" ? "/images/v2/clients-hero.jpg" : `/images/v3/services/${file === "scraping" ? "scrapping" : file}.jpg`,
    photo: file === "drying-unit" ? "/images/v2/clients-hero.jpg" : `/images/v2/services/${file === "scraping" ? "scrapping" : file}.jpg`,
    detail,
  };
}

/** Every wash / dry-process specialty, one image each — powers the homepage service gallery. */
export const allServices: ServiceItem[] = [
  service("01", "Bleach Wash", "bleach-wash", "Controlled bleaching lightens garment colour to the approved shade."),
  service("02", "Enzyme Wash", "enzyme-wash", "Enzyme treatment removes surface fuzz and softens the fabric for a cleaner hand-feel."),
  service("03", "Stone Wash", "stone-wash", "Pumice or approved abrasion media create a worn denim look with controlled fading."),
  service("04", "Enzyme Bleach Wash", "enzyme-bleach-wash", "Enzyme treatment and controlled bleaching combine softening with a lighter shade."),
  service("05", "Silicon Wash", "silicon-wash", "Silicone softener is applied during finishing to improve garment softness and hand-feel."),
  service("06", "Medium Stone Wash", "med-stone-wash", "A balanced stone-wash fade between light and dark denim finishes."),
  service("07", "Dark Stone Wash", "dark-stone-wash", "A controlled stone wash retains a deeper indigo tone with softened texture."),
  service("08", "Light Stone Wash", "light-stone-wash", "A stronger stone-wash effect creates a lighter, worn denim shade."),
  service("09", "Stone Enzyme Wash", "stone-enzyme-wash", "Stone abrasion and enzyme treatment work together for softness and a naturally faded surface."),
  service("10", "Overdye Wash", "overdye-wash", "A new dye shade is applied over the base garment colour for a layered colour effect."),
  service("11", "Pigment Wash", "pigment-wash", "Pigment colour is applied and washed back to create a vintage, surface-coloured appearance."),
  service("12", "Acid Wash", "acid-wash", "A high-contrast, cloudy fade creates a distinctive vintage denim effect."),
  service("13", "Grinding", "grinding", "Localised abrasion on seams, hems and edges creates a worn-in effect."),
  service("14", "Scraping", "scraping", "Selected garment areas are scraped for controlled, localised fading."),
  service("15", "PP Spray (Potassium Permanganate)", "pp-spray", "Targeted PP spray lightens selected garment areas to follow the approved design."),
  service("16", "Deep Dye", "deep-dye", "Dyeing creates a rich, saturated garment colour using an approved shade recipe."),
  service("17", "Tint Wash", "tint-wash", "A light tint shifts the garment shade subtly and evenly during finishing."),
  service("18", "Rubber Ball Wash", "rubber-ball-wash", "Rubber-ball tumbling adds a textured, worn surface to garments."),
  service("19", "Whisker Effects", "whisker", "Whisker lines are placed around the hip and thigh to match the approved reference."),
  service("20", "Hand Brush", "hand-brush", "Hand brushing creates controlled abrasion and natural-looking fade placement."),
  service("21", "Critical & Normal Garments Wash", "critical-wash", "Garments are processed using a suitable wash recipe for their fabric, construction and care needs."),
  service("22", "Custom Wash Standard", "wash-standard", "The approved reference is used to match shade, contrast and hand-feel consistently."),
];

/** Wash Library: process-led descriptions, with finished products presented last. */
export const washLibrary = [
  { id: "01", title: "Garment Production Floor", image: "/images/v2/facility-wide.jpg", detail: "A view of the factory floor and production equipment used across garment-washing operations." },
  { id: "02", title: "Enzyme Washing", image: "/images/v2/services/enzyme-wash.jpg", detail: "Enzyme washing is used to refine the garment surface and hand-feel. The exact effect depends on the fabric and approved wash recipe." },
  { id: "03", title: "Stone Washing", image: "/images/v2/services/stone-wash.jpg", detail: "Stone washing creates a worn, faded surface, especially on denim. The amount of abrasion is controlled to match the approved reference." },
  { id: "04", title: "Stone & Enzyme Wash", image: "/images/v2/services/stone-enzyme-wash.jpg", detail: "Stone abrasion and enzyme action can be combined to create a worn surface with a softer hand-feel. The balance depends on the approved reference." },
  { id: "05", title: "Bleach Wash", image: "/images/v2/services/bleach-wash.jpg", detail: "Controlled bleaching lightens garment colour toward the approved shade. Chemistry and processing conditions must suit the fabric and target result." },
  { id: "06", title: "Critical Wash Processing", image: "/images/v2/services/critical-wash.jpg", detail: "A suitable wash recipe is selected for the garment's fabric and construction, with the target finish checked against the approved standard." },
  { id: "07", title: "Industrial Drying", image: "/images/v2/qc-inspection.jpg", detail: "Industrial dryers remove remaining moisture from washed garments before inspection and any further finishing." },
  { id: "08", title: "Dyeing & Tinting", image: "/images/v2/services/deep-dye.jpg", detail: "Dye and tint processes adjust garment colour to the approved shade target. Colour samples are checked before the recipe is repeated at bulk scale." },
  { id: "09", title: "PP Spray Fading", image: "/images/v2/pp-spray.jpg", detail: "Potassium permanganate spray can create localized fading on selected garment areas. Application and neutralization must follow the approved process and safety controls." },
  { id: "10", title: "QC", image: "/images/v2/services/grinding.jpg", detail: "Grinding adds localized abrasion to selected garment areas. Placement and intensity should follow the approved design reference." },
  { id: "11", title: "Hand Brushing & Whisker Effects", image: "/images/v2/services/hand-brush.jpg", detail: "Hand finishing creates placed fading and directional marks. Whisker lines are positioned to match the approved design rather than applied uniformly." },
  { id: "12", title: "Hydro Extraction", image: "/images/v2/wash-dye.jpg", detail: "Wet garments are loaded into a hydro-extraction machine to remove excess water before industrial drying." },
  { id: "13", title: "Shade Swatches & Colour Approval", image: "/images/v2/swatches.jpg", detail: "Shade swatches provide a visual reference for colour approval. Compare the sample with the buyer's approved standard before releasing the bulk lot." },
  { id: "14", title: "Finish Products", image: "/images/v2/clients-hero.jpg", detail: "The final garments are reviewed against the approved standard for shade, appearance and measurements before handover." },
] as const;

/** Full process menu from the Glassy company profile. */
export const processMenu = {
  wet: [
    "Garments Wash",
    "Enzyme Wash",
    "Enzyme Stone Wash",
    "Bleach Wash",
    "Acid Wash",
    "Silicon Wash",
    "Towel Bleach",
    "Pigment Dyeing",
    "Reactive Dyeing",
    "Fluorescent Dyeing",
    "Sulfur Dyeing",
    "Dip Dyeing",
    "Cool Dyeing",
    "Tie Dyeing",
  ],
  dry: [
    "3D Crinkle Effects",
    "Destroy / Damaging",
    "Mending with Stitching",
    "Hand Brush",
    "Scraping",
    "Tagging",
    "Whisker",
    "PP Spray",
    "Wrinkle",
  ],
};

/** Machinery list from the Glassy company profile. */
export const machinery: [string, string][] = [
  ["Washing machines", "7"],
  ["Sample washing machines", "3"],
  ["Hydro machines", "2"],
  ["Sample hydro machine", "1"],
  ["Gas dryer machines", "5"],
  ["Dip dyeing machine", "1"],
  ["Lab machine", "1"],
  ["Tag machines", "2"],
  ["Stapler machines", "2"],
  ["3D crinkle machine", "1"],
  ["Hand brushes", "36"],
];

/** Utilities and support facilities from the Glassy company profile. */
export const facility: [string, string][] = [
  ["Boiler", "1 ton"],
  ["Compressor", "22 HP"],
  ["Water", "2 submersible pumps"],
  ["Laboratory room", "Modern and fully equipped"],
  ["Chemicals", "From an OEKO-TEX and Green certified supplier"],
  ["Carrying arrangement", "4 covered vans"],
  ["Location", "House 13, Wazuddin Rd, Vatara, Dhaka 1212"],
];

export const mission =
  "To deliver on our promises by ensuring quality and keeping trusted relationships with our clients, vendors and employees, by adopting best practices.";

export const vision =
  "To be an industry leader by leaving an exemplary footprint through quality service, with ethical and sustainable practice in the local and international market.";

export const floorPhotos: { src: string; title: string; caption: string }[] = [
  {
    src: "/images/v2/facility-wide.jpg",
    title: "The wash floor",
    caption:
      "Washing machines, hydro extractors and garment trolleys on one connected floor in Vatara.",
  },
  {
    src: "/images/v2/clients-hero.jpg",
    title: "Industrial drying units",
    caption: "Blue industrial drying machines and garment trolleys used to dry washed denim before inspection.",
  },
  {
    src: "/images/v2/wash-stone.jpg",
    title: "Garment washing",
    caption: "Garments are processed in industrial washing equipment to develop the approved wash effect.",
  },
  {
    src: "/images/v2/pp-spray.jpg",
    title: "PP spray station",
    caption: "The PP spray process creates targeted fading in selected areas of a garment, following the approved reference.",
  },
  {
    src: "/images/v2/wash-handwork.jpg",
    title: "Hand finishing",
    caption: "Hand-finishing techniques create controlled abrasion and detail on selected garment areas.",
  },
  {
    src: "/images/v2/qc-inspection.jpg",
    title: "Quality inspection",
    caption: "Each batch is checked for shade, hand-feel and measurements before handover.",
  },
  {
    src: "/images/v2/swatches.jpg",
    title: "Shade swatches",
    caption: "Colour samples are used to review and approve the target shade before bulk dyeing.",
  },
];

export const process: [string, string, string][] = [
  [
    "01",
    "Brief & swatch",
    "Send the reference — a photo, a competitor garment, or just a feeling.",
  ],
  [
    "02",
    "Lab dip & sample",
    "Approve a physical sample with the exact shade, hand-feel and placement.",
  ],
  [
    "03",
    "Bulk production",
    "Recipe cards lock chemistry, load, time and temperature for every repeat.",
  ],
  [
    "04",
    "QC & handover",
    "Shade banding, hand-feel and measurement checks before an export-ready handover.",
  ],
];

export const faqs: [string, string][] = [
  [
    "What is your minimum order quantity?",
    "We run sampling from a single piece and bulk programmes from 500 pieces per wash. For repeat clients there is no floor on top-ups — your recipe card stays on file.",
  ],
  [
    "How fast is a sample?",
    "Standard wash samples go back within 48–72 hours of receiving the garments. Complex dry-process or overdye development typically takes 4–5 days.",
  ],
  [
    "Can you match a buyer's wash standard?",
    "Yes. Send the approved standard or the reference garment and we will match shade, contrast and hand-feel, then document the recipe so bulk repeats it.",
  ],
  [
    "Do you handle dry process in-house?",
    "All of it — grinding, scrapping, PP spray, whiskering and hand brush are done on our own floor by our own operators, never subcontracted.",
  ],
];
