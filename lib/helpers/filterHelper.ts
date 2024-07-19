
class FilterHelper {

    async maps(query: any) {
        const conditions: any = [];

        if (query && query.search_string) {
            const searchString = `%${query.search_string}%`;
            conditions.push(`maps.title ILIKE '${searchString}'`);
        }

        if (query && query.status) {
            conditions.push(`maps.status = '${query.status}'`);
        }

        if (conditions.length > 0) {
            query = conditions.join("AND ");
        }

        return query;
    }

}

const filterHelper = new FilterHelper();
export default filterHelper