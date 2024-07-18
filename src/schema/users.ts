
import { index, pgEnum, pgTable, serial, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';


export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    password: varchar('password').notNull(),
    phone: varchar('phone').default(null),
    userType: integer('user_type').default(1),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},
    (table: any) => {
        return {
            email: index("email_idx").on(table.email)
        };
    });

