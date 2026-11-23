export const site = {
  name: "Online PowerToys",
  shortName: "PowerToys",
  tagline: "Fast, private tools for power users",
  /** Title of the home page; other pages use "<page title> | <name>". */
  homeTitle: "Online PowerToys: Free Text, JSON & Developer Tools",
  description:
    "Free tools that run in your browser: word counter, case converter, JSON formatter, Base64 encoder, UUID generator and age calculator. No sign-up or tracking.",
  url: "https://online-powertoys.netlify.app",
  locale: "en_US",
  author: {
    name: "Shahadat Anik",
    url: "https://shahadatanik.github.io/",
  },
  repository: "https://github.com/ShahadatAnik/Online-PowerToys--ReactJS-Tailwind",
  /** Browser UI colour per theme; matches the page background tokens in styles.css. */
  themeColor: { light: "#fefcfb", dark: "#080c15" },
  /** Brand orange, used where a single colour is needed (web manifest, Safari pinned tab). */
  brandColor: "#f0501c",
} as const

/** Prefix for every localStorage key the app writes. */
export const STORAGE_PREFIX = "powertoys:"
