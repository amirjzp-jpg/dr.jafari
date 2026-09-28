import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { site } from "@/lib/site";

const link = "text-muted no-underline hover:text-primary";

export function Footer() {
  return (
    <footer className="text-[13px] text-muted">
      <Container className="flex flex-col gap-5 border-t border-line pt-10 pb-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <span>© {site.clinicName}</span>
          <span>شماره نظام پزشکی: {site.councilNumber}</span>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            <li>
              <Link href="/privacy" className={link}>
                حریم خصوصی
              </Link>
            </li>
            <li>
              <Link href="/booking-policy" className={link}>
                قوانین نوبت‌دهی
              </Link>
            </li>
            {site.instagram && (
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                  اینستاگرام
                </a>
              </li>
            )}
          </ul>
          <span dir="ltr" lang="en" className="text-xs tracking-wide text-muted">
            Designed by Razats Creative Studio
          </span>
        </div>
      </Container>
    </footer>
  );
}
