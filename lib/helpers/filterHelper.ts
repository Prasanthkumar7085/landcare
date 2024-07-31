import { eq,and, ilike, or, desc, asc, ne, gte, lte } from "drizzle-orm";
import { mapMarkers } from "../schemas/mapMarkers";
import { lower, maps } from "../schemas/maps";

class FilterHelper {

    async maps(query: any, filters: any) {
        const conditions: any = [];

        if (filters && filters.search_string) {
            const searchString = `%${filters.search_string}%`;
            conditions.push(ilike(maps.title, `${searchString}`));
        }

        if (filters && filters.status) {
            conditions.push(eq(maps.status, `${filters.status}`));
        } else {
            conditions.push(ne(maps.status,'archived'));
        }

        if (filters.from_date && filters.to_date) {
            const fromDate = filters.from_date;
            const toDate = filters.to_date;
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            conditions.push(and(gte(maps.created_at, startDate), lte(maps.created_at, endDate)));
        }

        if(conditions.length > 0) {
            query = query.where(and(...conditions));     
        }

        return query;
    }


    async markers(query: any,filters:any,mapId:number) {
        const conditions: any = [];

        if (filters && filters.search_string) {
            const searchString = `%${filters.search_string}%`;
            conditions.push(and(
                ilike(mapMarkers.name, `${searchString}`),
                eq(mapMarkers.map_id, mapId)
            ));
        }

        if(conditions.length > 0) {
            query = query.where(and(...conditions));     
        }

        return query;
    }

    

}

const filterHelper = new FilterHelper();
export default filterHelper