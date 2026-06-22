-- Leaderboard scores for each test.
-- One row per submission; the API groups by nickname and takes each
-- player's best value for the Top 10.
CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_slug TEXT NOT NULL,
  nickname TEXT NOT NULL,
  value REAL NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scores_slug_value ON scores (test_slug, value);
