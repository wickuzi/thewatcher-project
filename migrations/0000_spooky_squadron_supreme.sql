CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."sold" AS ENUM('SOLD', 'NOT_SOLD');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'PENDING');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"status" "status" DEFAULT 'PENDING',
	"role" "role" DEFAULT 'USER',
	"last_activity_date" date DEFAULT now(),
	"last_inactive_email_sent" date,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "watchs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"rating" integer NOT NULL,
	"price" integer NOT NULL,
	"available_stock" integer NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"summary" text NOT NULL,
	"video_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "watchs_id_unique" UNIQUE("id")
);
