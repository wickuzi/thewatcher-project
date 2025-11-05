import { pgTable, unique, uuid, text, date, timestamp, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['USER', 'ADMIN'])
export const sold = pgEnum("sold", ['SOLD', 'NOT_SOLD'])
export const status = pgEnum("status", ['ACTIVE', 'PENDING'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: text("full_name").notNull(),
	email: text().notNull(),
	password: text().notNull(),
	status: status().default('PENDING'),
	role: role().default('USER'),
	lastActivityDate: date("last_activity_date").defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastInactiveEmailSent: date("last_inactive_email_sent"),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const watchs = pgTable("watchs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	brand: text().notNull(),
	category: text().notNull(),
	rating: integer().notNull(),
	price: integer().notNull(),
	availableStock: integer("available_stock").notNull(),
	description: text().notNull(),
	imageUrl: text("image_url").notNull(),
	summary: text().notNull(),
	videoUrl: text("video_url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
