# Technical Specification - Fix Lucide Icon Import Error

The application is experiencing a runtime error because the `Fridge` icon is being imported from `lucide-react`, but it is not available under that name in version `0.468.0`. The correct icon name in this version is `Refrigerator`.

## Technical Context
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Dependency**: `lucide-react` (v0.468.0)

## Implementation Approach
Replace all occurrences of `Fridge` with `Refrigerator` in the `hotel` module components. This includes:
1. Updating the import statements.
2. Updating the icon component usage.
3. Updating the mapping in `amenityIcons` or similar objects.

## Source Code Structure Changes
No new files or structural changes are required.

## Files to be Modified
- `frontend/app/hotel/components/RoomDetailModal.tsx`
- `frontend/app/hotel/components/NewRoomModal.tsx`
- `frontend/app/hotel/components/EditRoomModal.tsx`

## Data Model / API / Interface Changes
No changes to data models, APIs, or interfaces are necessary.

## Verification Approach
1. **Linting**: Run `npm run lint` in the `frontend` directory to ensure no other import errors exist.
2. **Build**: Run `npm run build` to verify that the TypeScript compilation and Next.js build process pass.
3. **Manual Verification**: (If a dev server is running) Verify that the modals open correctly without the "Unhandled Runtime Error".
