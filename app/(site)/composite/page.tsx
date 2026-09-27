import type { Metadata } from "next";
import { ServicePage } from "@/components/content/ServicePage";
import { serviceBySlug } from "@/content/services";

const service = serviceBySlug("composite")!;

export const metadata: Metadata = {
  title: service.title,
  description: service.metaDescription,
  alternates: { canonical: service.href },
};

export default function Page() {
  return <ServicePage service={service} />;
}
