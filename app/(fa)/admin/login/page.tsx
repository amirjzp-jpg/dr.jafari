import { redirect } from "next/navigation";
import { connection } from "next/server";
import { adminPhone } from "@/lib/auth/session";
import { configProblems, deploymentInfo } from "@/lib/config";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "ورود" };

const HELP: Record<string, string> = {
  DATABASE_URL: "پایگاه داده وصل نیست. نشانی اتصال PostgreSQL را در فایل تنظیمات سرور بگذارید.",
  OTP_SECRET: "یک رشته‌ی تصادفی دست‌کم ۳۲ نویسه‌ای با نام OTP_SECRET اضافه کنید.",
  ADMIN_PHONES: "شماره‌ی موبایل کارکنان را با نام ADMIN_PHONES اضافه کنید (مثلاً 09121234567).",
};

export default async function LoginPage() {
  await connection();
  const problems = configProblems();
  const dep = deploymentInfo();
  if (problems.length === 0 && (await adminPhone().catch(() => null))) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-dvh max-w-[420px] flex-col justify-center gap-6 px-5 py-10">
      <div className="flex flex-col gap-1">
        <span className="font-display text-2xl font-semibold">دکتر فاطمه جعفری</span>
        <h1 className="text-base text-muted">ورود به پنل کلینیک</h1>
      </div>

      {problems.length > 0 ? (
        <div role="alert" className="flex flex-col gap-3 rounded-2xl bg-[#F6E3E2] p-5 text-sm leading-[1.9] text-danger">
          <p className="font-medium">ورود ممکن نیست، چون تنظیمات سرور کامل نیست:</p>
          <ul className="flex flex-col gap-2 text-ink">
            {problems.map((p) => (
              <li key={p}>
                <code dir="ltr" className="rounded bg-surface px-1.5 py-0.5 text-xs">
                  {p}
                </code>{" "}
                {HELP[p]}
              </li>
            ))}
          </ul>
          <p className="text-ink">
            این‌ها را در فایل <code dir="ltr">/etc/dr-jafari.env</code> روی سرور اضافه کنید و سپس سرویس{" "}
            <code dir="ltr">dr-jafari</code> را دوباره راه‌اندازی کنید. راهنمای کامل در{" "}
            <code dir="ltr">docs/DEPLOY.md</code> است.
          </p>
          <p dir="ltr" className="rounded-lg bg-surface px-3 py-2 text-left font-mono text-xs text-muted-2">
            environment: {dep.env}
            {dep.commit && <> · version: {dep.commit}</>}
            {dep.host && <> · {dep.host}</>}
            {dep.builtAt && <> · built: {dep.builtAt}</>}
            {dep.nearMisses.length > 0 && <> · similar names found: {dep.nearMisses.map((k) => JSON.stringify(k)).join(", ")}</>}
          </p>
        </div>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
