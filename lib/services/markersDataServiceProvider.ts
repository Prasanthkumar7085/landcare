import { db } from "../database";
import { mapMarkers } from "../schemas/mapMarkers";
import {ilike,eq,and } from "drizzle-orm";


export class MarkersDataServiceProvider {
    
    async create(data: any) {
        return await db.insert(mapMarkers).values(data).returning()
    }

    async findByTitle(title: string) {
        const markerData = await db.select().from(mapMarkers).where(ilike(mapMarkers.title, `%${title}%`));
        return markerData[0];
    }

    async findByIdAndMapId(id: number, mapId: number) {
        const markerData = await db.select()
            .from(mapMarkers)
            .where(and(eq(mapMarkers.id, id), eq(mapMarkers.map_id, mapId)));
        return markerData[0];
    }
}