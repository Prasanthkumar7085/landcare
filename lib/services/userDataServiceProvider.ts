import { db } from "../database";
import { HashHelper } from "../helpers/hashHelper";
import { users } from "../schemas/users";

const hashHelper = new HashHelper();



export class UserDataServiceProvider {

    async create(data: any) {
        data.password = await hashHelper.hashPassword(data.password);
        return await db.insert(users).values(data).returning()
    }

}