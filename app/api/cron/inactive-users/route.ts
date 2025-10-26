import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { and, lt, eq, or, isNull } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const inactiveUsers = await db
      .select()
      .from(users)
      .where(
        and(
          lt(users.lastActivityDate, oneWeekAgoStr),
          or(
            isNull(users.lastInactiveEmailSent),
            lt(users.lastInactiveEmailSent, thirtyDaysAgoStr)
          )
        )
      );

    for (const user of inactiveUsers) {
      try {
        await sendWelcomeEmail({
          username: user.fullName || 'Usuario',
          to_email: user.email,
          message: '¡Hemos notado que hace tiempo que no nos visitas! Te invitamos a ver los nuevos modelos que hemos agregado recientemente.',
          from_name: 'TheWatcher Team',
          subject: '¡Echamos de menos verte en TheWatcher!'
        });

        await db
          .update(users)
          .set({ lastInactiveEmailSent: new Date().toISOString().split('T')[0] })
          .where(eq(users.id, user.id));
          
        console.log(`Email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Emails sent to ${inactiveUsers.length} inactive users` 
    });
  } catch (error) {
    console.error('Error in inactive users cron job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inactive users' },
      { status: 500 }
    );
  }
}
