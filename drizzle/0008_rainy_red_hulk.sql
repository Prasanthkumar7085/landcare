ALTER TABLE "map_markers" ALTER COLUMN "images" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "map_markers" ALTER COLUMN "tags" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "map_markers" ALTER COLUMN "social_links" SET DEFAULT '[]'::jsonb;