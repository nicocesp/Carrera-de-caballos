/**
 * Base de datos MySQL (XAMPP). Usa mysql2 con la misma interfaz prepare/get/run/all.
 */
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'carrera'
};

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(config);
  }
  return pool;
}

function getDb() {
  const p = getPool();
  return {
    prepare: (sql) => {
      const query = sql.replace(/\s+/g, ' ').trim();
      return {
        get: async (...params) => {
          const [rows] = await p.query(query, params);
          return rows && rows[0] != null ? rows[0] : null;
        },
        run: async (...params) => {
          const [result] = await p.query(query, params);
          const insertId = result.insertId != null ? result.insertId : 0;
          return { lastInsertRowid: insertId };
        },
        all: async (...params) => {
          const [rows] = await p.query(query, params);
          return Array.isArray(rows) ? rows : [];
        }
      };
    }
  };
}

async function runSchema() {
  const fs = require('fs');
  const path = require('path');
  const sqlPath = path.join(__dirname, 'schema-mysql.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const p = getPool();
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  for (const stmt of statements) {
    if (stmt) await p.query(stmt);
  }
}

module.exports = { getDb, runSchema };
