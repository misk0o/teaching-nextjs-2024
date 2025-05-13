import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE marketplace ADD COLUMN condition TEXT NOT NULL `.execute(
    db
  );
}
