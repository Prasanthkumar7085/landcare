import { db } from "../database";
import { HashHelper } from "../helpers/hashHelper";
import { users } from "../schemas/users";
import {eq} from "drizzle-orm";

const hashHelper = new HashHelper();



export class UserDataServiceProvider {

    async create(data: any) {
        data.password = await hashHelper.hashPassword(data.password);
        return await db.insert(users).values(data).returning()
    }

    async findUserByEmail(email: string) {
        const userData = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return userData[0];
    }

    async findById(id: number) {
        const userData = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return userData[0];
    }

}