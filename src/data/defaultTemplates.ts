export const defaultTemplates = [
  {
    id: "default-dark",
    active: true,
    name: "Default Dark",
    colors: {
      primary: "#a056c5ff", // electric-purple
      variant: "#2643c4", // royal-blue
      "text-100": "#e2fdff", // baby-powder
      "text-200": "#cbd5e1", // grayish-blue
      "text-300": "#9d9ab420", // grayish-blue
      "text-400": "#e2fdff12", // opaque-baby-powder
      "bg-100": "#08153c", // dark-blue
      "bg-200": "#081e60", // oxford-blue
      "bg-300": "#051956", // air-force-blue
    },
    description:
      "Dark theme for a modern look with electric purple and royal blue accents.",
    default: true,
  },
  {
    id: "default-light",
    active: false,
    name: "Default Light",
    colors: {
      primary: "#a056c5", // electric-purple
      variant: "#2643c4", // royal-blue
      "text-100": "#373b5e", // dark-blue
      "text-200": "#9d9ab4", // grayish-blue
      "text-300": "#c4c4c4", // light-gray
      "text-400": "#373b5e0f", // gray
      "bg-100": "#adbaeb", // lavender-blue
      "bg-200": "#ffffff", // white
      "bg-300": "#f4f6fd", // light-blue
    },
    description:
      "Light theme with a soft lavender-blue background and dark-blue text.",
    default: false,
  },
  {
    id: "default-desert",
    active: false,
    name: "Default Desert",
    colors: {
      primary: "#fbbf24", // yellow
      variant: "#f59e0b", // golden yellow
      "text-100": "#f9f2d8ff", // light yellow
      "text-200": "#e7e2cdff", // pale yellow
      "text-300": "#9b6e5eff", // golden yellow
      "text-400": "#7c2c1241", // dark yellow
      "bg-100": "#7c2d12",
      "bg-200": "#9a3412",
      "bg-300": "#c2410c",
    },
    description: "Desert theme with warm yellow tones and a sandy background.",
    default: false,
  },
];
