ALTER TABLE "map_markers" ADD COLUMN "facebook" text;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "twitter" text;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "instagram" text;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "youtube" text;--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "social_links";