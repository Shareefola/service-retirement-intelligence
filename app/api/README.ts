/**
 * app/api/README.md (scaffold)
 * 
 * API route placeholders — future Supabase integration.
 *
 * Planned routes:
 *   POST /api/computations        — Save a computation record
 *   GET  /api/computations        — List user's computations
 *   GET  /api/computations/[id]   — Retrieve single computation
 *   POST /api/auth/login          — Authenticate user
 *   POST /api/auth/logout         — Sign out
 *   GET  /api/settings            — Load user settings from DB
 *   PUT  /api/settings            — Save user settings to DB
 *
 * Architecture:
 *   - All handlers will use Supabase service role client
 *   - Auth via Supabase JWT verification middleware
 *   - Role-based access: 'admin' | 'staff'
 *   - All responses typed with shared zod schemas
 */

export {};
