# Security Policy

## Restricted Access
This repository contains proprietary code for the **Invitation Link** platform. Access is restricted to authorized personnel only.

### Data Privacy
- **Strictly Confidential**: No user data (PII) should ever be committed to this repository.
- **Secrets Management**: precise management of API keys.
    - NEVER commit `.env.local` or any file containing real API keys.
    - Use environment variables for all secrets.

### Reporting Vulnerabilities
If you discover a security vulnerability, please report it immediately to the project maintainer via private channel. DO NOT OPEN A PUBLIC ISSUE.

## Deployment Security
- Ensure all database connections use SSL.
- Enable Row Level Security (RLS) on all Supabase tables.
- Rotate API keys immediately if accidental exposure is suspected.
