import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/content/ServicePage";
import { serviceBySlug } from "@/content/services";

const service = serviceBySlug("composite")!;

export const metadata: Metadata = buildMetadata({
  title: service.title,
  description: service.metaDescription,
  path: service.href,
});

export default function Page() {
  return <ServicePage service={service} />;
}
