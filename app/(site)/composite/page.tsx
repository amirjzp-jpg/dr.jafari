import type { Metadata } from "next";
import { buildMetadata, ogCard } from "@/lib/seo";
import { ServicePage } from "@/components/content/ServicePage";
import { serviceBySlug } from "@/content/services";

const service = serviceBySlug("composite")!;

export const metadata: Metadata = buildMetadata({
  title: service.title,
  description: service.metaDescription,
  path: service.href,
  image: ogCard("composite", "کامپوزیت دندان در شیراز، کلینیک دکتر فاطمه جعفری"),
});

export default function Page() {
  return <ServicePage service={service} />;
}
