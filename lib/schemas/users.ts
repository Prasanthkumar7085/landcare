
import { index, pgEnum, pgTable, serial, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';

export const userTypeEnum = pgEnum('user_type', ['admin','user']);


export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    password: varchar('password').notNull(),
    phone: varchar('phone'),
    user_type: userTypeEnum('user_type').default('user'),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},
    (table: any) => {
        return {
            email: index("email_idx").on(table.email)
        };
    });

