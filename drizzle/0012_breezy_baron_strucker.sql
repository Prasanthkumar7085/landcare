ALTER TABLE "map_markers" RENAME COLUMN "type" TO "organisation_type";--> statement-breakpoint
ALTER TABLE "map_markers" RENAME COLUMN "full_address" TO "postal_address";--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "street_address" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "town" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "postcode" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "website" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "fax" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" ADD COLUMN "contact" varchar;--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "state";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "zipcode";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "position";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "host_organization";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "lls_region";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "location";--> statement-breakpoint
ALTER TABLE "map_markers" DROP COLUMN IF EXISTS "post_code";