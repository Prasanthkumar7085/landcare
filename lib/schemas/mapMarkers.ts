
import { index, integer, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, boolean } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { maps } from './maps';

export const mapMarkers:any = pgTable("map_markers", {
    id: serial('id').primaryKey(),
    map_id: integer('map_id').references(() => maps.id),

    name: varchar('name').notNull(),
    description: text('description'),
    landcare_region: varchar('landcare_region'),
    host: varchar('host'),
    host_type: varchar('host_type'),
    type: varchar('type').notNull(),

    street_address: varchar('street_address'),
    town: varchar('town'),
    postcode: varchar('postcode'),
    coordinates: jsonb('coordinates').$type<number[]>().default([]),

    phone_number: varchar('phone_number'),
    email: varchar('email'),
    website: varchar('website'),
    fax: varchar('fax'),
    contact: varchar('contact'),

    tags: jsonb('tags').$type<string[]>().default([]),
    image: text('image'),
    facebook: text('facebook'),
    twitter: text('twitter'),
    instagram: text('instagram'),
    youtube : text('youtube'),

    status: boolean('status').default(true),
    
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)
},
    (table: any) => {
        return {
            mapIdIdx: index("map_id_idx").on(table.map_id)
        };
    });

