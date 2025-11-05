import { integer, text, boolean, pgTable, uuid, pgEnum, date, timestamp, serial, jsonb } from "drizzle-orm/pg-core";

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

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  watchId: uuid('watch_id').references(() => watchs.id, { onDelete: 'set null' }),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const watchs = pgTable('watchs',{
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  category: text('category').notNull(),
  rating: integer('rating').notNull(),
  price: integer('price').notNull(),
  cost: integer('cost').notNull().default(0), // Costo del producto
  availableStock: integer('available_stock').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url').notNull(),
  summary: text('summary').notNull(),
  videoUrl: text('video_url').notNull(),
  createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
})