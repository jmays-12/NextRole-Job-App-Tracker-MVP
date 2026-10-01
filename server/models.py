import sqlite3

DB_FILE = "nextrole.db"

def get_conn():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row 
    return conn


def db_all(sql, args=()):
    conn = get_conn()
    rows = [dict(r) for r in conn.execute(sql, args).fetchall()]
    conn.close()
    return rows


def db_one(sql, args=()):
    rows = db_all(sql, args)
    return rows[0] if rows else None


def db_run(sql, args=()):
    """For INSERT/UPDATE/DELETE. Returns (last inserted id, rows changed)."""
    conn = get_conn()
    cur = conn.execute(sql, args)
    conn.commit()
    result = (cur.lastrowid, cur.rowcount)
    conn.close()
    return result


def init_db():
    conn = get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            company TEXT NOT NULL,
            role TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'applied',
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)
    conn.commit()
    conn.close()

init_db()