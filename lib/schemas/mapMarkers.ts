
import { index, integer, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, boolean } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { maps } from './maps';

export const mapMarkers = pgTable("map_markers", {
    id: serial('id').primaryKey(),
    map_id: integer('map_id').references(() => maps.id),

    title: varchar('title').notNull(),
    description: text('description'),
    type: varchar('type'),

    full_address: varchar('full_address').notNull(),
    state: varchar('state'),
    city: varchar('city'),
    zipcode: varchar('zipcode'),

    images: jsonb('images').$type<string[]>(),
    tags: jsonb('tags').$type<string[]>(),
    social_links: jsonb('social_links').$type<string[]>(),
    added_by: varchar('added_by'),

    status: boolean('status').default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
},
    (table: any) => {
        return {
            mapIdIdx: index("map_id_idx").on(table.map_id)
        };
    });

