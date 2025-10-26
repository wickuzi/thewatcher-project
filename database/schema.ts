import { integer, text, boolean, pgTable, uuid, varchar, pgEnum, date, timestamp } from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum('status',['ACTIVE','PENDING'])
export const ROLE_ENUM = pgEnum('role',['USER','ADMIN'])
export const SOLD_ENUM = pgEnum('sold',['SOLD','NOT_SOLD'])

export const users = pgTable("users", {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  status: STATUS_ENUM('status').default('PENDING'),
  role: ROLE_ENUM('role').default('USER'),
  lastActivityDate: date('last_activity_date').defaultNow(),
  lastInactiveEmailSent: date('last_inactive_email_sent'),
  createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
});