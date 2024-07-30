ALTER TABLE "map_markers" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "map_markers" ALTER COLUMN "coordinates" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "map_markers" ALTER COLUMN "full_address" DROP NOT NULL;