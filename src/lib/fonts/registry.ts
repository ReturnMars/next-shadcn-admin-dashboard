export const fontRegistry = {
  geist: {
    label: "Geist",
  },
  inter: {
    label: "Inter",
  },
  notoSans: {
    label: "Noto Sans",
  },
  nunitoSans: {
    label: "Nunito Sans",
  },
  figtree: {
    label: "Figtree",
  },
  roboto: {
    label: "Roboto",
  },
  raleway: {
    label: "Raleway",
  },
  dmSans: {
    label: "DM Sans",
  },
  publicSans: {
    label: "Public Sans",
  },
  outfit: {
    label: "Outfit",
  },
  geistMono: {
    label: "Geist Mono",
  },
  geistPixelSquare: {
    label: "Geist Pixel Square",
  },
  jetBrainsMono: {
    label: "JetBrains Mono",
  },
  geistSerif: {
    label: "Geist Serif",
  },
  notoSerif: {
    label: "Noto Serif",
  },
  robotoSlab: {
    label: "Roboto Slab",
  },
  merriweather: {
    label: "Merriweather",
  },
  lora: {
    label: "Lora",
  },
  playfairDisplay: {
    label: "Playfair Display",
  },
} as const;

export type FontKey = keyof typeof fontRegistry;
export const fontKeys = Object.keys(fontRegistry) as FontKey[];
export const fontOptions = fontKeys.map((key) => ({ key, label: fontRegistry[key].label }));
