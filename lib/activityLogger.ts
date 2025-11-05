import { db } from '@/database/drizzle';
import { activities } from '@/database/schema';

type ActivityType = 'watch_added' | 'stock_updated' | 'user_registered' | 'low_stock' | 'watch_updated' | 'user_updated';

interface ActivityData {
  userId?: string;
  watchId?: string;
  details?: Record<string, any>;
}

export async function logActivity(
  type: ActivityType,
  { userId, watchId, details = {} }: ActivityData
) {
  try {
    await db.insert(activities).values({
      type,
      userId,
      watchId,
      details,
      createdAt: new Date()
    });
    console.log(`✅ Actividad registrada: ${type}`);
  } catch (error) {
    console.error('❌ Error al registrar actividad:', error);
  }
}
