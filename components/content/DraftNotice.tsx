/** Visible until Dr. Jafari approves the copy (`reviewed: true`). */
export function DraftNotice({ reviewed }: { reviewed: boolean }) {
  if (reviewed) return null;
  return (
    <p className="rounded-xl bg-[#F3EDE3] px-4 py-3 text-sm text-[#6B4F24]">
      پیش‌نویس: این متن پس از بررسی و تأیید دکتر جعفری نهایی می‌شود.
    </p>
  );
}
