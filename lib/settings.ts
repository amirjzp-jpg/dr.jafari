import { query, type Db } from "./db";
import { DEFAULT_SETTINGS, validateSettings, type ScheduleSettings } from "./booking/schedule";

export async function getSettings(db?: Db): Promise<ScheduleSettings> {
  const { rows } = await query<{ data: unknown }>("SELECT data FROM settings WHERE id = 1", [], db);
  return (rows[0] && validateSettings(rows[0].data)) || DEFAULT_SETTINGS;
}

export async function saveSettings(s: ScheduleSettings, db?: Db): Promise<void> {
  await query(
    `INSERT INTO settings (id, data, updated_at) VALUES (1, $1, now())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [JSON.stringify(s)],
    db,
  );
}
