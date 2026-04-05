# TODO: Real Admin Permissions Backend + Frontend ✅

## ✅ Schema Updates
- [x] UserPermission model added
- [x] Prisma generate/db push (DB ready)

## Backend Needed (Users Module)
```
POST /admin/users/:id/permissions { permissions: [] } → sync UserPermission
GET /admin/users → users + permission count/role
GET /admin/users/:id/permissions → array permission names
```

## Frontend Hooks (useAdminUsers.ts) ✅
- useAdminUsers()
- useAdminUser(id)
- useAdminUserPermissions(id) 
- useUpdateUserPermissions()
- useDeleteUser()

## Integrate in page.tsx
```
- Replace setUsers([]) → useAdminUsers()
- fetchPermissions() → permissions from API
- onClick Editer → apiClient.get(`/admin/users/${id}`)
```

## Backend Endpoints (users.controller.ts)
```
@Get(':id/permissions')
@Get()
@Patch(':id/permissions')
```

**Next:** Backend controllers/service → real data flow! 🚀

