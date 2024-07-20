import { db } from "../database";
import { mapMarkers } from "../schemas/mapMarkers";
import {ilike } from "drizzle-orm";


export class MarkersDataServiceProvider {
    
    async create(data: any) {
        return await db.insert(mapMarkers).values(data).returning()
    }

    async findByTitle(title: string) {
        const markerData = await db.select().from(mapMarkers).where(ilike(mapMarkers.title, `%${title}%`)).limit(1);
        return markerData[0];
    }
}