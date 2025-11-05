import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';

export async function GET() {
  try {
    const allUsers = await db.select({
      id: users.id,
      name: users.fullName,
      email: users.email,
      role: users.role,
      lastActivity: users.lastActivityDate,
      createdAt: users.createdAt
    }).from(users);
    
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error al obtener los usuarios' },
      { status: 500 }
    );
  }
}
