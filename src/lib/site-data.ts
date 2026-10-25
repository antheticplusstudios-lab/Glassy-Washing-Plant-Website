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
  ["11,500", "sq ft under one roof"],
  ["120+", "skilled operators & technicians"],
  ["$2.5M+", "last-year volume"],
  ["650K", "pieces washed every month"],
];

export const washes = [
  {
    id: "01",
    title: "Stone & abrasion",
    copy: "Pumice-driven character with controlled contrast. We hold the abrasion level batch to batch.",
    image: "/images/v2/wash-stone.jpg",
    tags: [
      "Stone Wash",
      "MED Stone Wash",
      "Dark Stone Wash",
      "Light Stone Wash",
      "Stone Enzyme Wash",
      "Acid Wash",
      "Rubber Ball Wash",
    ],
  },
  {
    id: "02",
    title: "Enzyme & bleach",
    copy: "Bio-polishing and oxidative work for a clean, soft surface and a predictable shade drop.",
    image: "/images/v2/wash-dye.jpg",
    tags: [
      "Bleach Wash",
      "Enzyme Wash",
      "Enzyme Bleach Wash",
      "Silicon Wash",
      "Critical & Normal Garments Wash",
    ],
  },
  {
    id: "03",
    title: "Colour & overdye",
    copy: "Shade work with lab-dip discipline: build the recipe, prove it on a swatch, repeat it at bulk.",
    image: "/images/v2/swatches.jpg",
    tags: ["Over Dying Wash", "Pigment Wash", "Deep Dye", "Tint Wash", "As Per Any Wash Standard"],
  },
  {
    id: "04",
    title: "Dry process & handwork",
    copy: "Grinding, scrapping, PP spray, whiskering and hand brush. The detail that makes a garment yours.",
    image: "/images/v2/wash-handwork.jpg",
    tags: [
      "Grinding",
      "Scrapping",
      "PP Spray (Potassium Permanganate)",
      "All Kinds of Whisker",
      "Hand Brush",
    ],
  },
];

export const specialties = [
  "Bleach Wash",
  "Enzyme Wash",
  "Stone Wash",
  "Enzyme Bleach Wash",
  "Silicon Wash",
  "MED Stone Wash",
  "Dark Stone Wash",
  "Light Stone Wash",
  "Stone Enzyme Wash",
  "Over Dying Wash",
  "Pigment Wash",
  "Acid Wash",
  "Grinding",
  "Scrapping",
  "PP Spray (Potassium Permanganate)",
  "Deep Dye",
  "Tint Wash",
  "Rubber Ball Wash",
  "All Kinds of Whisker",
  "Hand Brush",
  "Critical & Normal Garments Wash",
  "As Per Any Wash Standard",
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
    image: `/images/v3/services/${file}.jpg`,
    photo: `/images/v2/services/${file}.jpg`,
    detail,
  };
}

/** Every wash / dry-process specialty, one image each — powers the homepage service gallery. */
export const allServices: ServiceItem[] = [
  service(
    "01",
    "Bleach Wash",
    "bleach-wash",
    "Controlled oxidative fading that lifts colour evenly for a clean, lighter shade.",
  ),
  service(
    "02",
    "Enzyme Wash",
    "enzyme-wash",
    "Bio-polishing with enzymes for a soft hand-feel and a smooth, lightly worn surface.",
  ),
  service(
    "03",
    "Stone Wash",
    "stone-wash",
    "Pumice stones tumbled with the garment for classic abrasion and visible contrast.",
  ),
  service(
    "04",
    "Enzyme Bleach Wash",
    "enzyme-bleach-wash",
    "Enzyme softening combined with bleach for a soft surface and a clean shade drop.",
  ),
  service(
    "05",
    "Silicon Wash",
    "silicon-wash",
    "A silicone finish after the wash for a silky, smooth hand-feel and a softer drape.",
  ),
  service(
    "06",
    "MED Stone Wash",
    "med-stone-wash",
    "Medium stone abrasion: a balanced fade between the light and dark washes.",
  ),
  service(
    "07",
    "Dark Stone Wash",
    "dark-stone-wash",
    "Gentle abrasion that keeps the deep indigo while softening the fabric.",
  ),
  service(
    "08",
    "Light Stone Wash",
    "light-stone-wash",
    "Stronger stone and fade treatment for a bright, washed-down look.",
  ),
  service(
    "09",
    "Stone Enzyme Wash",
    "stone-enzyme-wash",
    "Stones plus enzymes: textured abrasion with a soft, polished surface.",
  ),
  service(
    "10",
    "Over Dying Wash",
    "overdye-wash",
    "A second dye applied over the wash to shift or deepen the shade.",
  ),
  service(
    "11",
    "Pigment Wash",
    "pigment-wash",
    "Pigment colour applied then washed back for a vintage, faded tone.",
  ),
  service(
    "12",
    "Acid Wash",
    "acid-wash",
    "Marbled, high-contrast fade with a frosted, vintage character.",
  ),
  service(
    "13",
    "Grinding",
    "grinding",
    "Hand-guided abrasion on seams, edges and hems for a worn-in look.",
  ),
  service(
    "14",
    "Scrapping",
    "scrapping",
    "Hand-scraped abrasion on chosen areas for localised fading and a used feel.",
  ),
  service(
    "15",
    "PP Spray (Potassium Permanganate)",
    "pp-spray",
    "Potassium permanganate sprayed by hand to bleach selected areas, so fade lands where you want it.",
  ),
  service(
    "16",
    "Deep Dye",
    "deep-dye",
    "Rich, saturated colour built by dyeing, with the recipe proven on a swatch before bulk.",
  ),
  service(
    "17",
    "Tint Wash",
    "tint-wash",
    "A light colour tint added in the wash for a subtle, even shade shift.",
  ),
  service(
    "18",
    "Rubber Ball Wash",
    "rubber-ball-wash",
    "Rubber balls in the tumble add softness and a lightly textured, worn surface.",
  ),
  service(
    "19",
    "All Kinds of Whisker",
    "whisker",
    "Hand-placed whisker lines at the hip and thigh, made to match your reference.",
  ),
  service(
    "20",
    "Hand Brush",
    "hand-brush",
    "Hand-brushed abrasion for natural-looking fade placement you can direct.",
  ),
  service(
    "21",
    "Critical & Normal Garments Wash",
    "critical-wash",
    "Careful handling for delicate or complex garments, as well as everyday styles.",
  ),
  service(
    "22",
    "As Per Any Wash Standard",
    "wash-standard",
    "Send the approved standard: we match shade, contrast and hand-feel, then document the recipe.",
  ),
];


/** Wash Library: 14 distinct photo entries, ordered by process and with finished products last. */
export const washLibrary = [
  { id: "01", title: "Washing", image: "/images/v2/wash-stone.jpg", detail: "Garments are washed in industrial machines according to the approved process and shade." },
  { id: "02", title: "Hydro Extractor", image: "/images/v2/facility-wide.jpg", detail: "Hydro extraction removes excess water from garments after the wash cycle." },
  { id: "03", title: "Sample Machine", image: "/images/v2/services/enzyme-wash.jpg", detail: "Sample washing is used to approve the finish before bulk production." },
  { id: "04", title: "Drying Machine", image: "/images/v2/services/silicon-wash.jpg", detail: "Garments are dried after washing before inspection and finishing." },
  { id: "05", title: "QC", image: "/images/v2/qc-inspection.jpg", detail: "Quality control checks garment condition, shade and measurements before handover." },
  { id: "06", title: "Raw Products", image: "/images/v2/services/critical-wash.jpg", detail: "Incoming garments are organised for processing and batch tracking." },
  { id: "07", title: "PP Spray Station", image: "/images/v2/pp-spray.jpg", detail: "Targeted spray application creates controlled fading in selected garment areas." },
  { id: "08", title: "Handwork", image: "/images/v2/wash-handwork.jpg", detail: "Hand finishing adds controlled abrasion and garment details." },
  { id: "09", title: "Stone Wash", image: "/images/v2/services/stone-wash.jpg", detail: "Stone washing creates a worn denim appearance with controlled abrasion." },
  { id: "10", title: "Bleach Wash", image: "/images/v2/services/bleach-wash.jpg", detail: "Bleaching lightens garment colour to the approved shade." },
  { id: "11", title: "Enzyme Bleach Wash", image: "/images/v2/services/enzyme-bleach-wash.jpg", detail: "Enzyme and bleach treatments combine surface softening with controlled fading." },
  { id: "12", title: "Grinding", image: "/images/v2/services/grinding.jpg", detail: "Localised abrasion adds a worn effect to selected seams, edges and hems." },
  { id: "13", title: "Finish Product", image: "/images/v2/swatches.jpg", detail: "A product sample is reviewed against the approved appearance before bulk production." },
  { id: "14", title: "Finish Products", image: "/images/v2/services/overdye-wash.jpg", detail: "Finished garments are checked against the approved standard before handover." },
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
    src: "/images/v2/wash-stone.jpg",
    title: "Stone & abrasion",
    caption: "Washed denim stacked and sorted by shade after the stone and enzyme cycles.",
  },
  {
    src: "/images/v2/pp-spray.jpg",
    title: "PP spray station",
    caption: "Hand-applied potassium permanganate, placed exactly where the reference shows fade.",
  },
  {
    src: "/images/v2/wash-handwork.jpg",
    title: "Hand work",
    caption: "Scraping, grinding and hand brush done by our own operators, never subcontracted.",
  },
  {
    src: "/images/v2/qc-inspection.jpg",
    title: "Quality inspection",
    caption: "Each batch is checked for shade, hand-feel and measurements before handover.",
  },
  {
    src: "/images/v2/swatches.jpg",
    title: "Swatches & lab dips",
    caption: "Colour is proven on a swatch first, so the bulk run repeats the approved shade.",
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
