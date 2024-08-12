
import { index, integer, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, boolean } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { maps } from './maps';

export const mapMarkers:any = pgTable("map_markers", {
    id: serial('id').primaryKey(),
    map_id: integer('map_id').references(() => maps.id),

    title: varchar('title'),
    description: text('description'),
    organisation_type: varchar('organisation_type'),
    coordinates: jsonb('coordinates').$type<number[]>().default([]),
    color_code: varchar('color_code'),

    postal_address: varchar('postal_address'),
    street_address: varchar('street_address'),
    town: varchar('town'),
    postcode: varchar('postcode'),

    phone: varchar('phone'),
    email: varchar('email'),
    website: varchar('website'),
    fax: varchar('fax'),
    contact: varchar('contact'),

    tags: jsonb('tags').$type<string[]>().default([]),
    images: jsonb('images').$type<string[]>().default([]),
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

