ALTER TABLE "maps" RENAME COLUMN "puplished_on" TO "published_on";--> statement-breakpoint
ALTER TABLE "maps" RENAME COLUMN "puplished_by" TO "published_by";--> statement-breakpoint
ALTER TABLE "maps" DROP CONSTRAINT "maps_puplished_by_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maps" ADD CONSTRAINT "maps_published_by_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
