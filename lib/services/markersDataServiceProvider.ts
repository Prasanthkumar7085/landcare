import { db } from "../database";
import filterHelper from "../helpers/filterHelper";
import { mapMarkers } from "../schemas/mapMarkers";
import { ilike, eq, and, sql, desc, ne } from "drizzle-orm";


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

    async findAllByMapId(page: number, limit: number,mapId: number,filters:any) {
        let queryData:any = db.select({
            id: mapMarkers.id,
            title: mapMarkers.title,
            description: mapMarkers.description,
            type: mapMarkers.type,
            coordinates: mapMarkers.coordinates,
            full_address: mapMarkers.full_address,
            images: mapMarkers.images,
            tags: mapMarkers.tags,
            created_at: mapMarkers.created_at,
            updated_at: mapMarkers.updated_at
        })
            .from(mapMarkers)
            .where(eq(mapMarkers.map_id, mapId))
            .orderBy(desc(mapMarkers.id))
            .limit(limit)
            .offset(limit * (page - 1))
        queryData = filterHelper.markers(queryData, filters);
        return await queryData;
        
    }

    async findMarkersCount(query: any,mapId:number) {
        let countQuery :any= db.select({ count: sql`COUNT(*)` })
            .from(mapMarkers)
            .where((eq(mapMarkers.map_id, mapId)))
        countQuery = filterHelper.markers(countQuery, query);
        return await countQuery;
        
    }

    async findByTitleAndId(title: string, id: number,mapId: number) {
        const markerData = await db.select()
            .from(mapMarkers)
            .where(and(
                ilike(mapMarkers.title, `%${title}%`),
                eq(mapMarkers.map_id, mapId),
                ne(mapMarkers.id, id)
            ));
        return markerData[0];
    }

    async update(id: number, data: any) {
        return await db
            .update(mapMarkers)
            .set(data)
            .where(eq(mapMarkers.id, id))
    }

    async delete(id: number) {
        return await db
            .delete(mapMarkers)
            .where(eq(mapMarkers.id, id))
    }
}