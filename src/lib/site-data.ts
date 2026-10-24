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
  image: string;
};

/** Every wash / dry-process specialty, one image each — powers the homepage service gallery. */
export const allServices: ServiceItem[] = [
  { id: "01", title: "Bleach Wash", image: "/images/v2/services/bleach-wash.jpg" },
  { id: "02", title: "Enzyme Wash", image: "/images/v2/services/enzyme-wash.jpg" },
  { id: "03", title: "Stone Wash", image: "/images/v2/services/stone-wash.jpg" },
  { id: "04", title: "Enzyme Bleach Wash", image: "/images/v2/services/enzyme-bleach-wash.jpg" },
  { id: "05", title: "Silicon Wash", image: "/images/v2/services/silicon-wash.jpg" },
  { id: "06", title: "MED Stone Wash", image: "/images/v2/services/med-stone-wash.jpg" },
  { id: "07", title: "Dark Stone Wash", image: "/images/v2/services/dark-stone-wash.jpg" },
  { id: "08", title: "Light Stone Wash", image: "/images/v2/services/light-stone-wash.jpg" },
  { id: "09", title: "Stone Enzyme Wash", image: "/images/v2/services/stone-enzyme-wash.jpg" },
  { id: "10", title: "Over Dying Wash", image: "/images/v2/services/overdye-wash.jpg" },
  { id: "11", title: "Pigment Wash", image: "/images/v2/services/pigment-wash.jpg" },
  { id: "12", title: "Acid Wash", image: "/images/v2/services/acid-wash.jpg" },
  { id: "13", title: "Grinding", image: "/images/v2/services/grinding.jpg" },
  { id: "14", title: "Scrapping", image: "/images/v2/services/scrapping.jpg" },
  {
    id: "15",
    title: "PP Spray (Potassium Permanganate)",
    image: "/images/v2/services/pp-spray.jpg",
  },
  { id: "16", title: "Deep Dye", image: "/images/v2/services/deep-dye.jpg" },
  { id: "17", title: "Tint Wash", image: "/images/v2/services/tint-wash.jpg" },
  { id: "18", title: "Rubber Ball Wash", image: "/images/v2/services/rubber-ball-wash.jpg" },
  { id: "19", title: "All Kinds of Whisker", image: "/images/v2/services/whisker.jpg" },
  { id: "20", title: "Hand Brush", image: "/images/v2/services/hand-brush.jpg" },
  {
    id: "21",
    title: "Critical & Normal Garments Wash",
    image: "/images/v2/services/critical-wash.jpg",
  },
  { id: "22", title: "As Per Any Wash Standard", image: "/images/v2/services/wash-standard.jpg" },
];

export const process: [string, string, string][] = [
  ["01", "Brief & swatch", "Send the reference — a photo, a competitor garment, or just a feeling."],
  ["02", "Lab dip & sample", "Approve a physical sample with the exact shade, hand-feel and placement."],
  ["03", "Bulk production", "Recipe cards lock chemistry, load, time and temperature for every repeat."],
  ["04", "QC & handover", "Shade banding, hand-feel and measurement checks before an export-ready handover."],
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
