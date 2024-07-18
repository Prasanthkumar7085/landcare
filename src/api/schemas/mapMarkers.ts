
import { index, integer, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, boolean } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { maps } from './maps';
export const statusEnum = pgEnum('status', ['draft', 'active', 'publish', 'inactive', 'archived']);

export const mapMarkers = pgTable("map_markers", {
    id: serial('id').primaryKey(),
    mapId: integer('map_id').references(() => maps.id),

    title: varchar('title').notNull(),
    description: text('description'),
    type: varchar('type'),

    fullAddress: varchar('full_address').notNull(),
    state: varchar('state'),
    city: varchar('city'),
    zipcode: varchar('zipcode'),

    images: jsonb('images').$type<string[]>(),
    tags: jsonb('tags').$type<string[]>(),
    socialLinks: jsonb('social_links').$type<string[]>(),
    addedBy: varchar('added_by'),

    status: boolean('status').default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
},
    (table: any) => {
        return {
            mapIdIdx: index("map_id_idx").on(table.mapId)
        };
    });

