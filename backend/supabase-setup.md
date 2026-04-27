# Supabase Backend Setup

## 1. Update backend/.env
Add/update these lines:

```
DATABASE_URL="postgresql://postgres:Proverbe%3A17%3F@db.zfvqcjmbvxfnfscoaqzs.supabase.co:5432/postgres"
SUPABASE_URL="https://zfvqcjmbvxfnfscoaqzs.supabase.co"
SUPABASE_ANON_KEY="eyJ..." # From Supabase Dashboard > Settings > API > Project API keys > anon/public (copy full key)
JWT_SECRET="your_jwt_secret"
PORT=3000
```

**Note:** Password URL-encoded (`:` -> `%3A`, `?` -> `%3F`).

## 2. Install (running):
`npm --prefix backend install @supabase/supabase-js`

## 3. Generate Prisma client:
`npm --prefix backend run prisma:generate`

## 4. Push schema to Supabase:
`npm --prefix backend run prisma:db push`

Or `prisma migrate dev --name init-supabase`

## 5. Seed data if needed:
`npm --prefix backend run prisma:seed`

## 6. Run backend:
`npm --prefix backend run start:dev`

## 7. Test:
- Backend: http://localhost:3000
- Prisma Studio: `npm --prefix backend run prisma:studio`
- Supabase client: Inject SupabaseService in controller/service.

Get ANON_KEY from your Supabase dashboard!
