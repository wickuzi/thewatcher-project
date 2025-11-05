import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { activities, users, watchs } from '@/database/schema';
import { desc, eq } from 'drizzle-orm';

type ActivityType = 'watch_added' | 'stock_updated' | 'user_registered' | 'low_stock';

interface ActivityDetails {
  changes?: {
    stock?: {
      old: number;
      new: number;
    };
    [key: string]: any;
  };
  watchName?: string;
  email?: string;
  fullName?: string;
  user?: string;
  remaining?: number | string;
  [key: string]: any;
}

interface ActivityRecord {
  id: string;
  type: ActivityType;
  user?: string;
  watch?: string;
  email?: string;
  details?: ActivityDetails;
  date: Date;
}

export async function GET() {
  try {
    // Get recent activities with user and watch details
    const recentActivities = await db
      .select({
        id: activities.id,
        type: activities.type,
        user: users.fullName,
        email: users.email,
        watch: watchs.name,
        details: activities.details,
        date: activities.createdAt
      })
      .from(activities)
      .leftJoin(users, eq(activities.userId, users.id))
      .leftJoin(watchs, eq(activities.watchId, watchs.id))
      .orderBy(desc(activities.createdAt))
      .limit(20);

    // Format the activities for the frontend
    const formattedActivities = recentActivities.map(activity => {
      // Safely parse the details object
      const details = (activity.details || {}) as ActivityDetails;
      const activityType = activity.type as ActivityType;
      
      // For user_registered events, ensure we have the user's name from details
      if (activityType === 'user_registered') {
        const userDetails = {
          id: activity.id.toString(),
          type: activityType,
          user: details.fullName || details.user || activity.user || 'Nuevo usuario',
          email: details.email || activity.email || '',
          ...details,
          date: activity.date?.toISOString() || new Date().toISOString()
        };
        
        return userDetails;
      }
      
      // For other activity types
      return {
        id: activity.id.toString(),
        type: activityType,
        user: activity.user || 'System',
        watch: activity.watch || undefined,
        ...details,
        date: activity.date?.toISOString() || new Date().toISOString()
      };
    });

    return NextResponse.json({ 
      success: true,
      activities: formattedActivities 
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch activities' 
      },
      { status: 500 }
    );
  }
}
