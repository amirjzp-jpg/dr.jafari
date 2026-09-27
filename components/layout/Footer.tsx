import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="text-[13px] text-muted">
      <Container className="flex flex-col gap-4 pt-12 pb-10 md:flex-row md:items-end md:justify-between">
        <span>© {site.clinicName}</span>
        <ul className="flex flex-wrap gap-x-7 gap-y-2">
          <li>
            <Link href="/privacy" className="text-muted no-underline hover:text-primary">
              حریم خصوصی
            </Link>
          </li>
          <li>
            <Link href="/booking-policy" className="text-muted no-underline hover:text-primary">
              قوانین نوبت‌دهی
            </Link>
          </li>
          <li>
            {site.instagram ? (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted no-underline hover:text-primary"
              >
                اینستاگرام
              </a>
            ) : (
              // TODO-content.md: Instagram URL is still missing.
              <span>اینستاگرام [؟]</span>
            )}
          </li>
        </ul>
      </Container>
    </footer>
  );
}
