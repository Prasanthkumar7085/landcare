
import { index, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, integer, AnyPgColumn } from 'drizzle-orm/pg-core';

import { SQL, sql } from 'drizzle-orm';
import { users } from './users';
export const statusEnum = pgEnum('status', ['draft', 'active', 'publish', 'inactive', 'archived']);

export const maps :any= pgTable("maps", {

    id: serial('id').primaryKey(),

    title: varchar('title').notNull(),
    slug: varchar('slug').unique().notNull(),
    description: text('description'),

    status: statusEnum('status').default('draft'),
    published_on: timestamp('published_on'),
    published_by: integer('published_by').references(() => users.id),

    //TODO: Need to remove geo type and coordinates fields
    geo_type: varchar('geo_type').default('polygon'),
    geo_coordinates: jsonb('geo_coordinates').$type<number[]>().default([]),
    geo_zoom: integer('geo_zoom').default(0),
    image:text('image'),

    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)

},
    (table: any) => {
        return {
            slugIdx: index("slug_idx").on(table.slug),
            titleIdx: index("title_idx").on(table.title)
        };
    });

export function lower(title: AnyPgColumn): SQL {
    return sql`lower(${title})`;
}