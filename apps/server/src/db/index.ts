import {Database} from "bun:sqlite";
import {drizzle} from "drizzle-orm/bun-sqlite";
import schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL!);

export const db = drizzle({client: sqlite, schema});

db.run("PRAGMA journal_mode = WAL;");
