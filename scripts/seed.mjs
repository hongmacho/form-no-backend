#!/usr/bin/env node
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
const dbPath = process.env.DATABASE_PATH || "./form.db";
const db = new Database(dbPath);
const now = Math.floor(Date.now() / 1000);
console.log("🌱 Seeding form-no-backend...");
try {
  const forms = [];
  const fieldTypes = ['text', 'textarea', 'radio', 'checkbox', 'select', 'rating'];
  for (let i = 0; i < 3; i++) {
    const id = randomUUID();
    const publicId = 'form_' + randomUUID().slice(0, 8);
    forms.push(id);
    const fields = JSON.stringify([
      {id: randomUUID(), type: fieldTypes[i], label: `필드${i+1}`, required: true},
      {id: randomUUID(), type: fieldTypes[(i+1)%6], label: `필드${i+2}`, required: false},
      {id: randomUUID(), type: fieldTypes[(i+2)%6], label: `필드${i+3}`, required: true}
    ]);
    db.exec(`INSERT INTO forms VALUES ('${id}', '폼${i+1}', '설명', '${publicId}', '${fields.replace(/'/g, "''")}', 1, ${now}, ${now})`);
  }
  
  let respCount = 0;
  for (const formId of forms) {
    for (let j = 0; j < 10; j++) {
      const respId = randomUUID();
      const data = JSON.stringify({field1: `답변${j}`, field2: Math.random() > 0.5});
      db.exec(`INSERT INTO responses VALUES ('${respId}', '${formId}', '${data.replace(/'/g, "''")}', 'Mozilla/5.0', ${now + j})`);
      respCount++;
    }
  }
  
  console.log(`✅ Seeded: forms=3, responses=${respCount}`);
  console.log(JSON.stringify({seed: {ok: true, counts: {forms: 3, responses: respCount}}}));
} catch (e) {
  console.error("❌", e);
  process.exit(1);
} finally {
  db.close();
}
