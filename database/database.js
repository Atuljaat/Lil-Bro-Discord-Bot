const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("messages.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS global_message_stats (
      id INTEGER PRIMARY KEY,
      total_messages INTEGER NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS server_message_stats (
      server_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (server_id, user_id)
    )
  `);

  db.run(
    `
      CREATE TABLE IF NOT EXISTS wishes_channels (
        user_id TEXT NOT NULL ,
        server_id TEXT NOT NULL ,
        channel_id TEXT NOT NULL ,
        PRIMARY KEY (server_id)
      )
    `
  )

});

module.exports = db;
