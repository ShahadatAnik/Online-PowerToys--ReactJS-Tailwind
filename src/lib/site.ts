export const site = {
  name: "Online PowerToys",
  shortName: "PowerToys",
  tagline: "Fast, private tools for power users",
  description:
    "A collection of fast, free, privacy-friendly tools for power users: text converters, counters, formatters, encoders and calculators that run entirely in your browser.",
  url: "https://online-powertoys.netlify.app",
  author: {
    name: "Shahadat Anik",
    url: "https://shahadatanik.github.io/",
  },
  repository: "https://github.com/ShahadatAnik/Online-PowerToys--ReactJS-Tailwind",
  ogImage: "/android-chrome-512x512.png",
  themeColor: "#f97316",
} as const

/** Prefix for every localStorage key the app writes. */
export const STORAGE_PREFIX = "powertoys:"
