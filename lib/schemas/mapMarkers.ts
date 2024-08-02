
import { index, integer, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, boolean } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { maps } from './maps';

export const mapMarkers:any = pgTable("map_markers", {
    id: serial('id').primaryKey(),
    map_id: integer('map_id').references(() => maps.id),

    title: varchar('title').default(''),
    description: text('description').default(''),
    type: varchar('type').default(''),
    coordinates: jsonb('coordinates').$type<number[]>().default([]),
    color_code: varchar('color_code').default(''),

    full_address: varchar('full_address').default(''),
    state: varchar('state').default(''),
    city: varchar('city').default(''),
    zipcode: varchar('zipcode').default(''),

    name: varchar('name').default(''),
    position: text('position').default(''),
    host_organization: varchar('host_organization').default(''),
    lls_region: varchar('lls_region').default(''),
    phone: varchar('phone').default(''),
    email: varchar('email').default(''),
    location: varchar('location').default(''),
    post_code: varchar('post_code').default(''),

    images: jsonb('images').$type<string[]>().default([]),
    tags: jsonb('tags').$type<string[]>().default([]),
    social_links: jsonb('social_links').$type<string[]>().default([]),
    added_by: varchar('added_by').default(''),

    status: boolean('status').default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
},
    (table: any) => {
        return {
            mapIdIdx: index("map_id_idx").on(table.map_id)
        };
    });

