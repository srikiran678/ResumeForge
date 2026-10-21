# Spec Delta

## Purpose

Encapsulates backend persistence, InsForge SDK integration, PostgreSQL multi-tenant queries, and local workspace fallback caching.

## ADDED Requirements

### Requirement: InsForge SDK Client Lifecycle
The Database Services module SHALL manage authentication credentials, session token injection, and unified error handling across all PostgREST endpoints.

#### Scenario: Intercepting expired session tokens
- **WHEN** an authenticated query receives a 401 Unauthorized response from the InsForge backend
- **THEN** the module emits an auth expiration event and directs the application to refresh tokens or prompt re-login

### Requirement: Multi-Tenant Data Persistence
The Database Services module SHALL execute all CRUD operations against core tables (`resumes`, `master_profiles`, `applications`, `user_settings`) bound to the authenticated user ID.

#### Scenario: Saving a user resume
- **WHEN** a resume record is updated by an authenticated user
- **THEN** the database service updates the `resumes` table filtering strictly by `user_id` and document `id`

### Requirement: Immutable Snapshot Management
The Database Services module SHALL store point-in-time resume snapshots containing complete document state and optional version notes.

#### Scenario: Creating a snapshot
- **WHEN** a user or application trigger creates a resume snapshot
- **THEN** an immutable record is inserted into `resume_snapshots` with the current timestamp and serialized payload

### Requirement: Offline Caching and Workspace Synchronization
The Database Services module SHALL provide transparent local storage caching so users can continue editing without active network connectivity.

#### Scenario: Offline state mutation
- **WHEN** network connectivity is unavailable during an edit
- **THEN** the module writes the updated resume model to local persistent storage and marks the record pending sync
