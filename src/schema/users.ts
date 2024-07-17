
import { index, pgEnum, pgTable, serial, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';



export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    name: varchar("name").notNull(),
    username: varchar("username").notNull(),
    password: varchar("password").notNull(),
    email: varchar('email').default(null),
    phone: varchar('phone').default(null),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},
    (table: any) => {
        return {
            usernameIdx: index("username_idx").on(table.username)
        };
    });

