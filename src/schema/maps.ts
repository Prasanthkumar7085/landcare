
import { index, pgTable, pgEnum, serial, timestamp, varchar, text, jsonb, integer } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';
import { users } from './users';
export const statusEnum = pgEnum('status', ['draft', 'active', 'publish', 'inactive', 'archived']);

export const maps = pgTable("maps", {

    id: serial('id').primaryKey(),

    title: varchar('title').notNull(),
    slug: varchar('slug').unique().notNull(),
    description: text('description').default(null),

    status: statusEnum('status').default('draft'),
    puplishedOn: timestamp('puplished_on').default(null),
    puplishedBy: integer('puplished_by').references(() => users.id),

    geoType: varchar('geo_type'),
    geoCoordinates: jsonb('geo_coordinates').$type<number[]>(),
    geoZoom: integer('geo_zoom'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`)

},
    (table: any) => {
        return {
            slugIdx: index("slug_idx").on(table.slug)
        };
    });

