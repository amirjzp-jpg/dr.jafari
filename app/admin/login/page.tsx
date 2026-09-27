import { redirect } from "next/navigation";
import { connection } from "next/server";
import { adminPhone } from "@/lib/auth/session";
import { configProblems, smsIsMock } from "@/lib/config";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "ورود" };

const HELP: Record<string, string> = {
  DATABASE_URL: "پایگاه داده وصل نیست. در Vercel از بخش Storage یک پایگاه داده‌ی Neon بسازید و به پروژه وصل کنید.",
  OTP_SECRET: "یک رشته‌ی تصادفی دست‌کم ۳۲ نویسه‌ای با نام OTP_SECRET اضافه کنید.",
  ADMIN_PHONES: "شماره‌ی موبایل کارکنان را با نام ADMIN_PHONES اضافه کنید (مثلاً 09050897230).",
};

export default async function LoginPage() {
  await connection();
  const problems = configProblems();
  if (problems.length === 0 && (await adminPhone().catch(() => null))) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-dvh max-w-[420px] flex-col justify-center gap-6 px-5 py-10">
      <div className="flex flex-col gap-1">
        <span className="font-display text-2xl font-semibold">دکتر ندا جعفری</span>
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
            این‌ها را در Vercel، بخش Settings ← Environment Variables اضافه کنید و سپس Redeploy بزنید. راهنمای کامل در
            فایل <code dir="ltr">docs/DEPLOY.md</code> است.
          </p>
        </div>
      ) : (
        <>
          {smsIsMock() && (
            <div className="flex flex-col gap-2 rounded-2xl bg-[#F3EDE3] p-4 text-sm leading-[1.9] text-[#6B4F24]">
              <p className="font-medium">پیامک واقعی هنوز فعال نیست (sms.ir وصل نشده است).</p>
              <p>
                کد ورود به گوشی ارسال نمی‌شود. پس از زدن «دریافت کد ورود»، در Vercel به بخش Logs بروید و دنبال{" "}
                <code dir="ltr">sms:mock</code> بگردید؛ کد پنج‌رقمی جلوی <code dir="ltr">CODE</code> است.
              </p>
            </div>
          )}
          <LoginForm />
        </>
      )}
    </main>
  );
}
