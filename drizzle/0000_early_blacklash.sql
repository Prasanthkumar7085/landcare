DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('draft', 'active', 'publish', 'inactive', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "map_markers" (
	"id" serial PRIMARY KEY NOT NULL,
	"map_id" integer,
	"title" varchar NOT NULL,
	"description" text,
	"type" varchar,
	"full_address" varchar NOT NULL,
	"state" varchar,
	"city" varchar,
	"zipcode" varchar,
	"images" jsonb,
	"tags" jsonb,
	"social_links" jsonb,
	"added_by" varchar,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maps" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" text,
	"status" "status" DEFAULT 'draft',
	"puplished_on" timestamp,
	"puplished_by" integer,
	"geo_type" varchar,
	"geo_coordinates" jsonb,
	"geo_zoom" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "maps_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"phone" varchar,
	"user_type" "user_type" DEFAULT 'user',
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_puplished_by_users_id_fk" FOREIGN KEY ("puplished_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "map_id_idx" ON "map_markers" ("map_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slug_idx" ON "maps" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "maps" ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");