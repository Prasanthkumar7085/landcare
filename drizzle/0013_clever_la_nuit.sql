ALTER TABLE "map_markers" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "map_markers" RENAME COLUMN "organisation_type" TO "host_type";--> statement-breakpoint
ALTER TABLE "map_markers" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "landcare_region" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "host" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "type" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "phone_number" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "color_code";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "postal_address";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "phone";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "images";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "added_by";