import Link from "next/link";
import { connection } from "next/server";
import { adminLogout } from "../actions";
import { requireAdmin } from "@/lib/auth/session";
import { formatPhone } from "@/lib/phone";
import { AdminNav } from "./AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const phone = await requireAdmin();
  return (
    <div className="mx-auto flex min-h-dvh max-w-[1100px] flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-ivory/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link href="/admin" className="font-display text-lg font-semibold text-ink no-underline">
            پنل کلینیک
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="ltr-nums hidden sm:inline">{formatPhone(phone)}</span>
            <form action={adminLogout}>
              <button type="submit" className="text-primary">
                خروج
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="flex grow flex-col gap-5 px-4 py-5">{children}</main>
    </div>
  );
}
