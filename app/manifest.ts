import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "کلینیک دکتر ندا جعفری",
    short_name: "دکتر جعفری",
    description: "دندانپزشکی زیبایی شیراز · رزرو آنلاین نوبت",
    start_url: "/",
    display: "standalone",
    dir: "rtl",
    lang: "fa",
    background_color: "#FAF8F4",
    theme_color: "#E4EEF6",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
