import { DraftNotice } from "@/components/content/DraftNotice";
import { Container } from "@/components/layout/Container";

export type Section = { h: string; p?: string[]; ul?: string[] };

/** Simple long-form text for policy pages. */
export function Prose({ sections, reviewed = false }: { sections: Section[]; reviewed?: boolean }) {
  return (
    <Container className="pb-24">
      <div className="flex max-w-[720px] flex-col gap-10">
        <DraftNotice reviewed={reviewed} />
        {sections.map((s) => (
          <section key={s.h} className="flex flex-col gap-3">
            <h2 className="font-display text-[22px] font-semibold lg:text-[26px]">{s.h}</h2>
            {s.p?.map((t) => (
              <p key={t} className="text-[16px] leading-[2] text-muted-2">
                {t}
              </p>
            ))}
            {s.ul && (
              <ul className="flex flex-col gap-2">
                {s.ul.map((t) => (
                  <li key={t} className="flex gap-3 text-[16px] leading-[1.9] text-muted-2">
                    <span aria-hidden="true" className="mt-[12px] size-1.5 shrink-0 rounded-full bg-blue-mid" />
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </Container>
  );
}
