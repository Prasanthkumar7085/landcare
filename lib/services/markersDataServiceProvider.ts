import { db } from "../database";
import filterHelper from "../helpers/filterHelper";
import { mapMarkers } from "../schemas/mapMarkers";
import { ilike, eq, and, sql, desc, ne, inArray, asc } from "drizzle-orm";
import { lower } from "../schemas/maps";


export class MarkersDataServiceProvider {

    async create(data: any) {
        return await db.insert(mapMarkers).values(data).returning()
    }

    async findByTitleAndMapId(title: string, mapId: number) {
        const markerData = await db.select()
            .from(mapMarkers)
            .where(and(
                eq(lower(mapMarkers.title), title.toLowerCase()),
                eq(mapMarkers.map_id, mapId)
            ));
        return markerData[0];
    }

    async findByTitles(titles: string[]) {
        if (titles.length === 0) {
            return [];
        } else {
            titles = titles.map(title => title.toLowerCase());
            const markerData = await db.select()
                .from(mapMarkers)
                .where(inArray(lower(mapMarkers.title), titles));
            return markerData;
        }
    }

    async findByIdAndMapId(id: number, mapId: number) {
        const markerData = await db.select()
            .from(mapMarkers)
            .where(and(eq(mapMarkers.id, id), eq(mapMarkers.map_id, mapId)));
        return markerData[0];
    }

    async findAllByMapId(page: number, limit: number, mapId: number, filters: any) {
        let queryData: any = db.select({
            id: mapMarkers.id,
            name: mapMarkers.name,
            position: mapMarkers.position,
            host_organization: mapMarkers.host_organization,
            lls_region: mapMarkers.lls_region,
            phone: mapMarkers.phone,
            email: mapMarkers.email,
            location: mapMarkers.location,
            post_code: mapMarkers.post_code,
            created_at: mapMarkers.created_at,
            updated_at: mapMarkers.updated_at
        })
            .from(mapMarkers)
            .where(eq(mapMarkers.map_id, mapId))
            .limit(limit)
            .offset(limit * (page - 1))
             
        // Apply dynamic sorting
        if (filters.sort_by && filters.sort_type) {
            const sortColumn = mapMarkers[filters.sort_by];
            const sortOrder = filters.sort_type.toLowerCase() === 'asc' ? asc(sortColumn) : desc(sortColumn);
            queryData = queryData.orderBy(sortOrder);
        } else {
            // Default sorting
            queryData = queryData.orderBy(desc(mapMarkers.created_at));
        }

        queryData = filterHelper.markers(queryData, filters, mapId);
        return await queryData;

    }

    async findMarkersCount(query: any, mapId: number) {
        let countQuery: any = db.select({ count: sql`COUNT(*)` })
            .from(mapMarkers)
            .where((eq(mapMarkers.map_id, mapId)))
        countQuery = filterHelper.markers(countQuery, query, mapId);
        return await countQuery;

    }

    async findByTitleAndId(title: string, id: number, mapId: number) {
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

    async deleteByMapId(mapId: number) {
        return await db
            .delete(mapMarkers)
            .where(eq(mapMarkers.map_id, mapId))
    }
}