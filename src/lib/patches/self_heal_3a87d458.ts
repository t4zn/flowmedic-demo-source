/**
 * FlowMedic Automated Self-Healing Patch
 * Target Issue: #6 - Prevent duplicate records on repeated sync
 * Run ID: 3a87d458-dc00-4874-837c-65c28a0b0c5d
 * 
 * Diagnosis: Running repository sync multiple times inserts duplicate records instead of updating existing ones.
 * Root Cause: The database lacks a unique constraint on the source key, and the ingestion query uses a standard INSERT statement rather than an upsert mechanism.
 */

CREATE UNIQUE INDEX idx_repo_github_issue ON github_issues (repository_name, github_issue_id);

INSERT INTO github_issues (repository_name, github_issue_id, title, state, body, url, source_updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (repository_name, github_issue_id)
DO UPDATE SET 
  title = EXCLUDED.title,
  state = EXCLUDED.state,
  body = EXCLUDED.body,
  url = EXCLUDED.url,
  source_updated_at = EXCLUDED.source_updated_at;
