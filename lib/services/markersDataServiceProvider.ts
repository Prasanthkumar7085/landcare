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

    async findAllByMapId(skip: number, limit: number, mapId: number, filters: any) {
        let queryData: any = db.select({
            id: mapMarkers.id,
            title: mapMarkers.title,
            description: mapMarkers.description,
            coordinates: mapMarkers.coordinates,
            contact: mapMarkers.contact,
            organisation_type: mapMarkers.organisation_type,
            phone: mapMarkers.phone,
            email: mapMarkers.email,
            postal_address: mapMarkers.postal_address,
            street_address: mapMarkers.street_address,
            town: mapMarkers.town,
            postcode: mapMarkers.postcode,
            website: mapMarkers.website,
            created_at: mapMarkers.created_at,
            updated_at: mapMarkers.updated_at
        })
            .from(mapMarkers)
            .where(eq(mapMarkers.map_id, mapId))
            .limit(limit)
            .offset(skip)
             
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

    async findAllByMapIdWithCoordinates(mapId: number, lat: number, lng: number) {
       
       return await db.select({
            id: mapMarkers.id,
            title: mapMarkers.title,
            description: mapMarkers.description,
            coordinates: mapMarkers.coordinates,
            contact: mapMarkers.contact,
            organisation_type: mapMarkers.organisation_type,
            phone: mapMarkers.phone,
            email: mapMarkers.email,
            postal_address: mapMarkers.postal_address,
            street_address: mapMarkers.street_address,
            town: mapMarkers.town,
            postcode: mapMarkers.postcode,
            website: mapMarkers.website,
            created_at: mapMarkers.created_at,
            updated_at: mapMarkers.updated_at
        })
            .from(mapMarkers)
            .where(and(
                eq(mapMarkers.map_id, mapId),
                eq(mapMarkers.coordinates, [lat,lng])
            ))
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
            .where(eq(mapMarkers.id, id)).returning()
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