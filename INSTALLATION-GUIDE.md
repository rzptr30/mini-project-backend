# 📦 INSTALASI ADMIN ENDPOINT - STEP BY STEP

## ⏱️ Estimasi Waktu: 15-20 Menit

## 📋 FILE-FILE YANG PERLU DITAMBAHKAN/DIUPDATE

### 1. CREATE NEW FILES (Copy ke lokasi yang tepat)

#### a. `src/auth/guards/roles.guard.ts` (NEW)
```
Lokasi: src/auth/guards/roles.guard.ts
File: roles.guard.ts (yang sudah saya generate)
```

#### b. `src/auth/decorators/roles.decorator.ts` (NEW)
```
Lokasi: src/auth/decorators/ (buat folder baru)
File: roles.decorator.ts (yang sudah saya generate)
```

#### c. `src/create-admin.ts` (NEW)
```
Lokasi: src/create-admin.ts
File: create-admin.ts (yang sudah saya generate)
```

### 2. UPDATE EXISTING FILES

#### a. `src/users/users.controller.ts` (UPDATE)
```
Replace seluruh isi file dengan: users.controller.ts yang baru
```

#### b. `src/users/users.service.ts` (UPDATE)
```
Replace seluruh isi file dengan: users.service.ts yang baru
```

#### c. `README.md` (UPDATE)
```
Replace seluruh isi file dengan: README.md yang baru
```

#### d. `package.json` (UPDATE)
```
Tambahkan script "create-admin": "ts-node src/create-admin.ts"
Lihat file: package.json-script-addition.txt
```

---

## 🚀 LANGKAH INSTALASI

### Step 1: Buat Folder Baru (jika belum ada)
```bash
mkdir -p src/auth/decorators
```

### Step 2: Copy File Baru

**File 1: RolesGuard**
```bash
# Copy roles.guard.ts ke src/auth/guards/roles.guard.ts
```

**File 2: Roles Decorator**
```bash
# Copy roles.decorator.ts ke src/auth/decorators/roles.decorator.ts
```

**File 3: Create Admin Script**
```bash
# Copy create-admin.ts ke src/create-admin.ts
```

### Step 3: Update File yang Ada

**File 4: Users Controller**
```bash
# Replace src/users/users.controller.ts dengan yang baru
```

**File 5: Users Service**
```bash
# Replace src/users/users.service.ts dengan yang baru
```

**File 6: README**
```bash
# Replace README.md dengan yang baru
```

**File 7: Package.json**
```bash
# Edit package.json
# Tambahkan di bagian "scripts":
"create-admin": "ts-node src/create-admin.ts"
```

### Step 4: Install Dependencies (jika belum)
```bash
npm install @nestjs/core @nestjs/common
npm install --save-dev ts-node
```

### Step 5: Test Compilation
```bash
npm run build
```

Jika ada error, fix import statements yang salah.

### Step 6: Jalankan Aplikasi
```bash
npm run start:dev
```

### Step 7: Buat Admin User
```bash
npm run create-admin
```

Output yang diharapkan:
```
✅ Admin user created successfully!
Email: admin@example.com
Password: admin123
Role: admin

⚠️  IMPORTANT: Change the password after first login!
```

---

## 🧪 TESTING

### Test 1: Login sebagai Admin
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Expected: 200 OK dengan access_token dan user.role = "admin"

### Test 2: Access Admin Endpoint
```bash
GET http://localhost:3000/users
Authorization: Bearer <admin_access_token>
```

Expected: 200 OK dengan list semua users

### Test 3: Access sebagai Regular User (should FAIL)
```bash
# Login as regular user first
POST http://localhost:3000/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Try to access admin endpoint
GET http://localhost:3000/users
Authorization: Bearer <regular_user_token>
```

Expected: 403 Forbidden

### Test 4: Pagination
```bash
GET http://localhost:3000/users?page=1&limit=5
Authorization: Bearer <admin_access_token>
```

Expected: 200 OK dengan max 5 users per page

### Test 5: Search
```bash
GET http://localhost:3000/users?search=admin
Authorization: Bearer <admin_access_token>
```

Expected: 200 OK dengan users yang email-nya mengandung "admin"

---

## ✅ CHECKLIST SETELAH INSTALASI

- [ ] File roles.guard.ts exists di src/auth/guards/
- [ ] File roles.decorator.ts exists di src/auth/decorators/
- [ ] File create-admin.ts exists di src/
- [ ] Users controller updated
- [ ] Users service updated
- [ ] README.md updated
- [ ] package.json has create-admin script
- [ ] npm run build berhasil
- [ ] npm run start:dev berhasil
- [ ] npm run create-admin berhasil
- [ ] Login as admin works
- [ ] GET /users as admin returns 200
- [ ] GET /users as regular user returns 403

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module '@nestjs/core'"
```bash
npm install @nestjs/core
```

### Error: "ts-node command not found"
```bash
npm install --save-dev ts-node
```

### Error: "Admin user already exists"
```
Ini normal jika Anda sudah run npm run create-admin sebelumnya.
Gunakan credentials yang sama untuk login.
```

### Error: 403 saat access /users padahal sudah login as admin
```
Check:
1. JWT token masih valid (belum expired)
2. User.role di database = "admin"
3. RolesGuard sudah registered di controller
```

### Error: Import statements error
```
Pastikan semua import path benar:
- import { RolesGuard } from '../auth/guards/roles.guard';
- import { Roles } from '../auth/decorators/roles.decorator';
```

---

## 📊 STRUKTUR FOLDER SETELAH INSTALASI

```
src/
├── auth/
│   ├── decorators/           ← NEW FOLDER
│   │   └── roles.decorator.ts  ← NEW FILE
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── refresh.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts     ← NEW FILE
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── users.controller.ts    ← UPDATED
│   ├── users.module.ts
│   └── users.service.ts       ← UPDATED
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
└── create-admin.ts            ← NEW FILE
```

---

## 🎯 FINAL CHECK

Setelah semua langkah selesai:

1. ✅ Application runs without errors
2. ✅ Admin user created successfully
3. ✅ Admin can access GET /users
4. ✅ Regular user gets 403 on GET /users
5. ✅ Pagination works
6. ✅ Search works
7. ✅ README updated with new endpoint

---

Jika semua checklist ✅, maka implementasi admin endpoint BERHASIL! 🎉
