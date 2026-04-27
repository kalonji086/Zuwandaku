# 🚀 Setup Guide - ZUWAndaku

## What's Been Done ✅

### Backend
- [x] NestJS project structure
- [x] Authentication module (JWT + Passport)
- [x] Properties CRUD API
- [x] Vehicles CRUD API
- [x] Contracts CRUD API
- [x] Prisma ORM configured
- [x] PostgreSQL schema designed
- [x] Environment configuration
- [x] CORS enabled
- [x] Input validation
- [x] All dependencies installed (968 packages)

### Frontend
- [x] Next.js 14 project
- [x] Tailwind CSS setup
- [x] Authentication pages (login/register)
- [x] Dashboard page
- [x] Properties listing
- [x] Vehicles listing
- [x] API client (Axios)
- [x] React Query hooks
- [x] All dependencies installed (980 packages)

### Database
- [x] Prisma schema (User, Property, Vehicle, Contract, Province, Ville, Quartier)
- [x] Relationships configured
- [x] Enums defined (Role, PropertyType, Status, etc.)
- [x] PostgreSQL ready

---

## 🔧 Next Steps to Run Locally

### 1️⃣ Install Docker (if not installed)
Download from https://www.docker.com/products/docker-desktop

### 2️⃣ Start PostgreSQL Container
```bash
cd c:\Users\NouveauNom\Desktop\Mark
docker-compose up -d
```
✅ Database runs on `localhost:5432`

### 3️⃣ Setup database
```bash
cd backend

# Run migrations
npx prisma migrate dev --name init

# Seed test data
npx prisma db seed
```

### 4️⃣ Start Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```
✅ Backend: http://localhost:3000
✅ API docs available at endpoints

### 5️⃣ Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend: http://localhost:3001

---

## 📝 Test Credentials (after seeding)

```
Admin
  Email: admin@zuwandaku.com
  Password: admin123

Property Owner
  Email: owner@zuwandaku.com
  Password: owner123

Client
  Email: client@zuwandaku.com
  Password: client123
```

---

## 🧪 API Testing

### Register New User
```bash
POST http://localhost:3000/auth/register
{
  "email": "newuser@test.com",
  "password": "password123",
  "name": "User Name",
  "phone": "+243812345678",
  "role": "CLIENT"
}
```

### Login
```bash
POST http://localhost:3000/auth/login
{
  "email": "admin@zuwandaku.com",
  "password": "admin123"
}
```

### Get Properties
```bash
GET http://localhost:3000/properties
GET http://localhost:3000/properties?minPrice=100000&maxPrice=500000
```

### Create Property
```bash
POST http://localhost:3000/properties
Authorization: Bearer <token>
{
  "type": "MAISON",
  "provinceId": "<provinceId>",
  "villeId": "<villeId>",
  "price": 250000,
  "description": "Nice house",
  "surface": 200
}
```

---

## 📦 Project Structure

```
Mark/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT authentication
│   │   ├── properties/        # Properties module
│   │   ├── vehicles/          # Vehicles module
│   │   ├── contracts/         # Contracts module
│   │   ├── config/            # Configuration
│   │   ├── prisma/            # Prisma setup
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # Root layout + navbar
│   │   ├── page.tsx           # Home page
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── properties/
│   │   └── vehicles/
│   ├── lib/
│   │   ├── api-client.ts      # Axios setup
│   │   └── hooks.ts           # React Query hooks
│   ├── package.json
│   └── .env.local
│
├── docker-compose.yml
├── README.md
└── SETUP.md (this file)
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Backend (3000)
npx kill-port 3000

# Frontend (3001)  
npx kill-port 3001
```

### Database connection error
- Check if Docker is running: `docker-compose ps`
- Check credentials in `.env` match docker-compose.yml
- Reset database: `npx prisma migrate reset --force`

### Prisma generation error
```bash
npx prisma generate
```

### CORS errors
- Backend CORS is configured for localhost:3001
- Check backend main.ts corsOrigins array

---

## 🚀 When Ready to Deploy

1. Update environment variables for production
2. Use PostgreSQL managed service (AWS RDS, Heroku, etc.)
3. Deploy backend to hosting (Vercel, Render, Railway, etc.)
4. Deploy frontend to Vercel
5. Update API URLs in frontend
6. Setup custom domain (optional)

---

## 📚 Useful Commands

```bash
# Backend
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npx prisma studio         # Open Prisma Studio GUI
npx prisma migrate dev    # Create migration
npx prisma db seed        # Run seed script

# Frontend
npm run dev                # Start dev server
npm run build              # Build optimized
npm run lint               # Check code

# Database
docker-compose up -d       # Start containers
docker-compose down        # Stop containers
docker-compose ps          # List services
```

---

## ✨ Next Features to Add

- [ ] Payment integration
- [ ] Google Maps API
- [ ] Image upload (Cloudinary)
- [ ] Admin dashboard
- [ ] Advanced search filters
- [ ] Push notifications
- [ ] SMS/WhatsApp integration
- [ ] Mobile app (React Native)
- [ ] Email verification
- [ ] Two-factor authentication

---

## 📞 Support

For issues or questions, check:
1. `.env` configuration
2. Docker running status
3. Database connection
4. Port availability
5. Node.js version (18+)

Happy coding! 🎉
