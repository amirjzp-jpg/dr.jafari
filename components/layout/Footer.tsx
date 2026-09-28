import Link from "next/link";
import { InstagramIcon } from "@/components/icons/ui";
import { Container } from "@/components/layout/Container";
import { toFaDigits } from "@/lib/digits";
import { site } from "@/lib/site";

const link = "text-muted no-underline hover:text-primary";
const year = toFaDigits(new Date().getFullYear());

export function Footer() {
  return (
    <footer className="text-[13px] text-muted">
      <Container className="flex flex-col gap-5 border-t border-line pt-10 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-ink">
            © {year} {site.name}
          </span>
          <span>شماره نظام پزشکی: {site.councilNumber}</span>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <li>
              <Link href="/gallery" className={link}>
                نمونه‌کارها
              </Link>
            </li>
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
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`اینستاگرام ${site.instagramHandle}`}
                  data-umami-event="instagram_click"
                  className={`${link} -my-2.5 inline-flex items-center gap-1.5 py-2.5`}
                >
                  <InstagramIcon size={16} />
                  اینستاگرام
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>
      <Container className="border-t border-line py-5 text-center">
        <span dir="ltr" lang="en" className="text-xs font-semibold tracking-wide text-ink">
          Designed by Razats
        </span>
      </Container>
    </footer>
  );
}
