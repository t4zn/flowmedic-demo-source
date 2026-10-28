/**
 * FlowMedic Automated Self-Healing Patch
 * Target Issue: #6 - Prevent duplicate records on repeated sync
 * Run ID: c8381ba2-36b2-4c07-a65c-5f48c161b751
 * 
 * Diagnosis: Running repository sync multiple times creates duplicate entries in the github_issues table instead of updating existing records.
 * Root Cause: The database lacks a unique constraint on the natural key (repository and GitHub issue ID), and the ingestion logic uses a plain INSERT statement.
 */

CREATE UNIQUE INDEX idx_repo_github_issue ON github_issues (repository, github_issue_id);

INSERT INTO github_issues (repository, github_issue_id, title, state, body, url, source_updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (repository, github_issue_id)
DO UPDATE SET
  title = EXCLUDED.title,
  state = EXCLUDED.state,
  body = EXCLUDED.body,
  url = EXCLUDED.url,
  source_updated_at = EXCLUDED.source_updated_at;
