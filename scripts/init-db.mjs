#!/usr/bin/env node
import Database from "better-sqlite3";
const dbPath = process.env.DATABASE_PATH || "./form.db";
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
try {
  db.exec(`CREATE TABLE IF NOT EXISTS forms (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, public_id TEXT NOT NULL UNIQUE, fields TEXT NOT NULL, is_published INTEGER DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`);
  db.exec(`CREATE TABLE IF NOT EXISTS responses (id TEXT PRIMARY KEY, form_id TEXT NOT NULL, data TEXT NOT NULL, user_agent TEXT, created_at INTEGER NOT NULL)`);
  console.log("✅ DB initialized");
} catch (e) {
  console.error("❌", e);
  process.exit(1);
} finally {
  db.close();
}
