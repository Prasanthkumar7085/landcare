import { eq,and, ilike, or, desc, asc } from "drizzle-orm";
import { mapMarkers } from "../schemas/mapMarkers";
import { lower } from "../schemas/maps";

class FilterHelper {

    async maps(query: any) {
        const conditions: any = [];

        if (query && query.search_string) {
            const searchString = `%${query.search_string}%`;
            conditions.push(`maps.title ILIKE '${searchString}'`);
        }

        if (query && query.status) {
            conditions.push(`maps.status = '${query.status}'`);
        } else {
            conditions.push(`maps.status != 'archived'`);
        }

        if (query.from_date && query.to_date) {
            const fromDate = query.from_date;
            const toDate = query.to_date;
            conditions.push(`maps.created_at >= '${fromDate} 00:00:00' AND maps.created_at <= '${toDate} 23:59:59'`);
        }

        if (conditions.length > 0) {
            query = conditions.join("AND ");
        }

        return query;
    }


    async markers(query: any,filters:any) {
        const conditions: any = [];

        if (filters && filters.search_string) {
            const searchString = `%${filters.search_string}%`;
            conditions.push(or(
                ilike(mapMarkers.title, `${searchString}`),
                ilike(mapMarkers.type, `${searchString}`)
            ));
        }

        if (filters && filters.type) {
            conditions.push(eq(lower(mapMarkers.type), `${filters.type.toLowerCase()}`));
        }

        if(conditions.length > 0) {
            query = query.where(and(...conditions));     
        }

        return query;
    }

    

}

const filterHelper = new FilterHelper();
export default filterHelper