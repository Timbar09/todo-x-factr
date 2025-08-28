export const defaultTemplates = [
  {
    id: "default-dark",
    active: true,
    name: "Dark",
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
    name: "Light",
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
];
