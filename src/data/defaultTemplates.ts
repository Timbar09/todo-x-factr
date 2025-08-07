import TemplateItem from "../model/Template";

const defaultTemplates: TemplateItem[] = [
  new TemplateItem("default", "Dark", {
    primary: "#a056c5", // electric-purple
    variant: "#2643c4", // royal-blue
    "text-100": "#e2fdff", // baby-powder
    "text-200": "#cbd5e1", // grayish-blue
    "text-300": "#9d9ab420", // grayish-blue
    "text-400": "#e2fdff12", // opaque-baby-powder
    "bg-100": "#08153c", // dark-blue
    "bg-200": "#081e60", // oxford-blue
    "bg-300": "#051956", // air-force-blue
  }),
  new TemplateItem("light", "Light", {
    primary: "#a056c5", // electric-purple
    variant: "#2643c4", // royal-blue
    "text-100": "#373b5e", // dark-blue
    "text-200": "#9d9ab4", // grayish-blue
    "text-300": "#c4c4c4", // light-gray
    "text-400": "#e2fdff44", // gray
    "bg-100": "#adbaeb", // lavender-blue
    "bg-200": "#ffffff", // white
    "bg-300": "#f4f6fd", // light-blue
  }),
  new TemplateItem("forest", "Forest", {
    primary: "#794516", // brown
    variant: "#563366", // dark purple
    "text-100": "#f0fdf4", // mint cream
    "text-200": "#bbf7d0", // light green
    "text-300": "#86efac", // pastel green
    "text-400": "#6ee7b7", // soft green
    "bg-100": "#064e3b",
    "bg-200": "#065f46",
    "bg-300": "#047857",
  }),
  new TemplateItem("desert", "Desert", {
    primary: "#7c2d12",
    variant: "#9a3412",
    "text-100": "#fef3c7", // light yellow
    "text-200": "#fde68a", // pale yellow
    "text-300": "#fcd34d", // golden yellow
    "text-400": "#fbbf24", // bright yellow
    "bg-100": "#7c2d12",
    "bg-200": "#9a3412",
    "bg-300": "#c2410c",
  }),
];

export default defaultTemplates;
