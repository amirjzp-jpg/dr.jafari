import { redirect } from "next/navigation";
import { connection } from "next/server";
import { adminPhone } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "ورود" };

export default async function LoginPage() {
  await connection();
  if (await adminPhone().catch(() => null)) redirect("/admin");
  return (
    <main className="mx-auto flex min-h-dvh max-w-[400px] flex-col justify-center gap-6 px-5">
      <div className="flex flex-col gap-1">
        <span className="font-display text-2xl font-semibold">دکتر ندا جعفری</span>
        <h1 className="text-base text-muted">ورود به پنل کلینیک</h1>
      </div>
      <LoginForm />
    </main>
  );
}
