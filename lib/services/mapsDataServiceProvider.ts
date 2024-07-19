import { eq, ilike, sql,and, ne } from "drizzle-orm";
import { db } from "../database";
import { maps } from "../schemas/maps";


export class MapsDataServiceProvider {

    async create(data: any) {
        return await db.insert(maps).values(data).returning()
    }

    async findMapByTitle(title: string) {
        const mapData = await db.select().from(maps).where(ilike(maps.title, `%${title}%`));
        return mapData[0];
    }

    async findById(id: number) {
        const mapData = await db.select().from(maps).where(eq(maps.id, id));
        return mapData[0];
    }

    async findAll(page: number, limit: number, filters: any) {

        let query = sql`
        SELECT
           maps.id,
           maps.title,
           maps.description,
           maps.status,
           maps.puplished_on,
           maps.puplished_by,
           maps.created_at,
           maps.updated_at
        FROM maps
        ${Object.keys(filters).length > 0 ? sql`WHERE ${sql.raw(filters)}` : sql``}
        ORDER BY 
           maps.id DESC
        LIMIT ${limit} 
        OFFSET ${limit * (page - 1)}`;

        return await db.execute(query)
    }

    async findMapsCount(query: any) {
        const statement = sql`
               SELECT
                  COUNT(*) AS count
               FROM maps
               ${Object.keys(query).length > 0 ? sql`WHERE ${sql.raw(query)}` : sql``}
               `;
               
        return await db.execute(statement)

    }

    async findMapByTitleAndId(title: string, id: number) {
        const mapData = await db.select()
            .from(maps)
            .where(and(
                ilike(maps.title, `%${title}%`),
                ne(maps.id, id)
            ))
        return mapData[0];
    }

    async findMapBySlugAndId(slug: string, id: number) {
        const mapData = await db.select()
            .from(maps)
            .where(and(
                ilike(maps.slug, `%${slug}%`),
                ne(maps.id, id)
            ))
        return mapData[0];
    }

    async update(id: number, data: any) {
        return await db
            .update(maps)
            .set(data)
            .where(eq(maps.id, id))
    }
}