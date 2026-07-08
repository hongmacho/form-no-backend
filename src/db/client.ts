import 'server-only'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'

const dbPath = path.join(process.cwd(), 'form-builder.db')

let db: ReturnType<typeof drizzle>

function getDb() {
  if (!db) {
    const sqlite = new Database(dbPath)
    sqlite.pragma('journal_mode = WAL')
    db = drizzle(sqlite, { schema })

    // Initialize schema
    try {
      const migrations = sqlite.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='forms'
      `)
      if (!migrations.all().length) {
        // Create tables if they don't exist
        sqlite.exec(`
          CREATE TABLE IF NOT EXISTS forms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            public_id TEXT NOT NULL UNIQUE,
            fields TEXT NOT NULL DEFAULT '[]',
            is_published INTEGER DEFAULT 1,
            created_at INTEGER,
            updated_at INTEGER
          );

          CREATE TABLE IF NOT EXISTS responses (
            id TEXT PRIMARY KEY,
            form_id TEXT NOT NULL,
            data TEXT NOT NULL,
            user_agent TEXT,
            created_at INTEGER,
            FOREIGN KEY (form_id) REFERENCES forms(id)
          );

          CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);
        `)
      }
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }
  return db
}

export { getDb }
export type Database = typeof db
