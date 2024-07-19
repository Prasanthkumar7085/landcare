import { db } from "../database";
import { maps } from "../schemas/maps";
import {ilike,eq } from "drizzle-orm";


export class MapsDataServiceProvider {

    async create(data: any) {
        return await db.insert(maps).values(data).returning()
    }

    async findMapByTitle(title: string) {
        const mapData = await db.select().from(maps).where(ilike(maps.title, `%${title}%`)).limit(1);
        return mapData[0];
    }

    async findById(id: number) {
        const mapData = await db.select().from(maps).where(eq(maps.id, id)).limit(1);
        return mapData[0];
    }
}