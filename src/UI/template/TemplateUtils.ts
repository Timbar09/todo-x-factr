import { ColorScheme } from "../../model/Template";

export default class TemplateUtils {
  static reduceOpacity(color: string, opacity: number): string {
    return (
      color +
      Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")
    );
  }

  static lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  static createColorScheme(
    primaryColor: string,
    textColor: string,
    bgColor: string
  ): ColorScheme {
    return {
      primary: primaryColor,
      "text-100": textColor,
      "text-200": TemplateUtils.reduceOpacity(textColor, 0.7),
      "text-300": TemplateUtils.reduceOpacity(textColor, 0.5),
      "text-400": TemplateUtils.reduceOpacity(textColor, 0.125),
      variant: primaryColor,
      "bg-100": bgColor,
      "bg-200": TemplateUtils.lightenColor(bgColor, 5),
      "bg-300": TemplateUtils.lightenColor(bgColor, 10),
    };
  }
}
