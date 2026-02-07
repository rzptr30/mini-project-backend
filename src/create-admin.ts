import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if admin already exists
    const existingAdmin = await usersService.findByEmail('admin@example.com');
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Email: admin@example.com');
      await app.close();
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await usersService.create({
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }

  await app.close();
}

createAdminUser();
