
import { index, integer, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, boolean } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { maps } from './maps';

export const mapMarkers:any = pgTable("map_markers", {
    id: serial('id').primaryKey(),
    map_id: integer('map_id').references(() => maps.id),

    title: varchar('title'),
    description: text('description'),
    type: varchar('type'),
    coordinates: jsonb('coordinates').$type<number[]>().default([]),
    color_code: varchar('color_code'),

    full_address: varchar('full_address'),
    state: varchar('state'),
    city: varchar('city'),
    zipcode: varchar('zipcode'),

    name: varchar('name'),
    position: text('position'),
    host_organization: varchar('host_organization'),
    lls_region: varchar('lls_region'),
    phone: varchar('phone'),
    email: varchar('email'),
    location: varchar('location'),
    post_code: varchar('post_code'),

    images: jsonb('images').$type<string[]>().default([]),
    tags: jsonb('tags').$type<string[]>().default([]),
    social_links: jsonb('social_links').$type<string[]>().default([]),
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

