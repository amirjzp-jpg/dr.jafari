import { Flash } from "@/components/admin/ui";
import { timeOptions } from "@/lib/admin-options";
import { SLOT_MINUTES } from "@/lib/booking/schedule";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "تنظیمات" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const sp = await searchParams;
  const settings = await getSettings();
  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-semibold">تنظیمات نوبت‌دهی</h1>
        <p className="text-sm text-muted">
          طول هر نوبت {SLOT_MINUTES.toLocaleString("fa-IR")} دقیقه است. تغییر ساعت‌ها روی نوبت‌های ثبت‌شده اثری ندارد.
        </p>
      </div>
      <Flash m={sp.m} />
      <SettingsForm settings={settings} times={timeOptions(6, 24)} />
    </>
  );
}
