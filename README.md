# Mini Project Backend - Authentication System

Backend API untuk sistem autentikasi pengguna dengan NestJS, MongoDB, dan JWT.

## 🛠️ Tech Stack

- **NestJS** - Framework backend
- **MongoDB** - Database (dengan Mongoose ODM)
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **class-validator** - Request validation

## 📋 Prerequisites

Sebelum menjalankan project ini, pastikan sudah terinstall:

- Node.js (v18 atau lebih baru)
- npm atau yarn
- MongoDB Atlas account (atau MongoDB local)

## 🚀 Installation & Setup

### 1. Clone repository
```bash
git clone https://github.com/rzptr30/mini-project-backend.git
cd mini-project-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

Buat file `.env` di root folder dengan isi:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/miniproject?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=1h
PORT=3000
```

**Catatan:** Ganti `username` dan `password` dengan kredensial MongoDB Atlas Anda.

### 4. Jalankan aplikasi

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "698612ca2250b2a5602454d2",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Response Error - Email sudah terdaftar (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

**Response Error - Validasi gagal (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTg2MTJjYTIyNTBiMmE1NjAyNDU0ZDIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTczODc4MjAwMCwiZXhwIjoxNzM4Nzg1NjAwfQ.xxxxxxxxxxxxx",
  "user": {
    "id": "698612ca2250b2a5602454d2",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Response Error - Kredensial salah (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### 3. Get User Profile (Protected Route)

**Endpoint:** `GET /users/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response Success (200 OK):**
```json
{
  "id": "698612ca2250b2a5602454d2",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2026-02-06T16:11:54.547Z"
}
```

**Response Error - Token tidak ada/tidak valid (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 📸 API Testing Screenshots

### Register Endpoint Tests

#### 1. Register Success (201)
![Register Success](./docs/screenshots/1-register-success.png)

#### 2. Register - Duplicate Email (409)
![Register Duplicate](./docs/screenshots/2-register-duplicate.png)

#### 3. Register - Validation Error (400)
![Register Validation Error](./docs/screenshots/3-register-validation-error.png)

---

### Login Endpoint Tests

#### 4. Login Success (200)
![Login Success](./docs/screenshots/4-login-success.png)

#### 5. Login - Wrong Password (401)
![Login Wrong Password](./docs/screenshots/5-login-wrong-password.png)

#### 6. Login - Email Not Found (401)
![Login Email Not Found](./docs/screenshots/6-login-email-not-found.png)

---

### Protected Route Tests

#### 7. Get Profile - Unauthorized (401)
![Get Profile Unauthorized](./docs/screenshots/7-get-profile-unauthorized.png)

#### 8. Get Profile - Success (200)
![Get Profile Success](./docs/screenshots/8-get-profile-success.png)

---

### Database Verification

#### 9. MongoDB Atlas - User Data
![MongoDB Data](./docs/screenshots/9-mongodb-data.png)

*Screenshot menunjukkan data user tersimpan dengan password ter-hash menggunakan bcrypt*

## 🏗️ Struktur Project
```
mini-project-backend/
├── docs/
│   └── screenshots/          # API testing screenshots
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security Features

- **Password Hashing:** Semua password di-hash menggunakan bcrypt dengan salt rounds 10
- **JWT Expiration:** Access token berlaku selama 1 jam (dapat dikonfigurasi di `.env`)
- **Protected Routes:** Endpoint sensitif dilindungi dengan JWT Guard menggunakan Passport Strategy
- **Email Validation:** Email divalidasi format dan disimpan dalam lowercase untuk konsistensi
- **Unique Email:** Database schema memastikan tidak ada duplikasi email (unique index)
- **No Password Exposure:** Password hash tidak pernah dikembalikan dalam response API

## 💡 Design Decisions

### 1. Password Hashing
Menggunakan **bcrypt dengan 10 salt rounds** untuk mencapai balance antara security dan performance. Salt rounds 10 sudah cukup aman untuk mayoritas aplikasi production.

### 2. JWT Token Lifecycle
- **Access token expires dalam 1 jam** - balance antara security dan user experience
- Token disimpan di client-side (localStorage atau cookies)
- Untuk production, disarankan menambahkan **refresh token mechanism** untuk auto-renewal

### 3. Database Schema Design
- **Email:** unique index, lowercase normalization, required field
- **Password:** bcrypt hash dengan salt, tidak pernah di-return ke client
- **Role:** default "user", enum ["user", "admin"] untuk future role-based access control
- **Timestamps:** `createdAt` dan `updatedAt` dikelola otomatis oleh Mongoose

### 4. Error Handling Strategy
- **Consistent HTTP status codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 409 (Conflict)
- **Generic error messages** untuk authentication failures (tidak membedakan "email tidak ada" vs "password salah") sebagai security best practice
- **Validation errors** memberikan detail spesifik untuk membantu debugging di development

### 5. API Response Structure
Semua response mengikuti struktur yang konsisten:
```typescript
// Success
{ message: string, data?: any }

// Error (handled by NestJS Exception Filters)
{ statusCode: number, message: string | string[], error: string }
```

## 🧪 Testing Guide

### Manual Testing dengan Postman

1. **Import Collection** (jika tersedia file `.json`)
2. **Set Base URL:** `http://localhost:3000`
3. **Test Flow:**
   - Register user baru
   - Login dengan kredensial tersebut
   - Copy `access_token` dari response
   - Test endpoint `/users/me` dengan Bearer Token
   - Test endpoint protected tanpa token (harusnya 401)

### Test Cases Checklist

- [ ] Register dengan email valid → 201
- [ ] Register dengan email duplikat → 409
- [ ] Register dengan email format salah → 400
- [ ] Register dengan password < 6 karakter → 400
- [ ] Login dengan kredensial benar → 200 + token
- [ ] Login dengan password salah → 401
- [ ] Login dengan email tidak terdaftar → 401
- [ ] Akses `/users/me` tanpa token → 401
- [ ] Akses `/users/me` dengan token valid → 200 + user data
- [ ] Akses `/users/me` dengan token expired → 401

## 📦 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | Yes |
| `JWT_SECRET` | Secret key untuk JWT signing | `your-super-secret-key` | Yes |
| `JWT_EXPIRES_IN` | Token expiration duration | `1h`, `24h`, `7d` | Yes |
| `PORT` | Application port | `3000` | No (default: 3000) |

**Security Note:** Jangan commit file `.env` ke repository! Pastikan `.env` ada di `.gitignore`.

## 🚧 Future Improvements / Roadmap

Fitur-fitur yang bisa ditambahkan di masa depan:

- [ ] **Refresh Token Mechanism** - Auto-renewal token tanpa re-login
- [ ] **Token Revocation (Blacklist)** - Invalidate token saat logout
- [ ] **Rate Limiting** - Proteksi dari brute force attack pada login endpoint
- [ ] **Email Verification** - Konfirmasi email sebelum akses penuh
- [ ] **Role-Based Access Control (RBAC)** - Admin endpoints untuk manage users
- [ ] **Forgot Password Feature** - Reset password via email
- [ ] **Two-Factor Authentication (2FA)** - Extra layer security
- [ ] **Account Lockout** - Lock account setelah multiple failed login attempts
- [ ] **Audit Logging** - Track user activities
- [ ] **Unit & E2E Tests** - Automated testing dengan Jest
- [ ] **Swagger/OpenAPI Documentation** - Interactive API docs
- [ ] **Docker Containerization** - Easy deployment dengan Docker
- [ ] **CI/CD Pipeline** - Automated testing & deployment
- [ ] **Monitoring & Logging** - Integration dengan tools seperti Winston, Sentry

## 🐛 Known Issues / Limitations

- Access token tidak bisa di-revoke sebelum expired (solusi: implementasi refresh token + blacklist)
- Tidak ada rate limiting (rentan terhadap brute force attack)
- Tidak ada email verification (siapapun bisa register dengan email apapun)

## 📖 API Documentation

Untuk dokumentasi API yang lebih interaktif, pertimbangkan untuk menambahkan Swagger:
```bash
npm install @nestjs/swagger swagger-ui-express
```

Lalu akses di: `http://localhost:3000/api/docs`

## 🤝 Contributing

Jika ini adalah project open-source, tambahkan contribution guidelines di sini.

## 👨‍💻 Developer

**Muhammad Reza**
- Email: muhammadrezaputraprasetyo@gmail.com
- GitHub: [@rzptr30](https://github.com/rzptr30)
- LinkedIn: [Muhammad Reza Putra Prasetyo](https://www.linkedin.com/in/muhammad-reza-putra-prasetyo/)

## 📄 License

This project is created for **Relove internship assignment** purposes.

---

## 🙏 Acknowledgments

- [NestJS Documentation](https://docs.nestjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)

---

**Created with ❤️ using NestJS**

*Last Updated: February 6, 2026*