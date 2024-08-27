import { eq, sql, and, ne, desc, asc } from "drizzle-orm";
import { db } from "../database";
import { lower, maps } from "../schemas/maps";
import filterHelper from "../helpers/filterHelper";
import { users } from "../schemas/users";


export class MapsDataServiceProvider {

    async create(data: any) {
        return await db.insert(maps).values(data).returning()
    }

    async findMapByTitle(title: string) {
        const mapData = await db.select()
            .from(maps)
            .where(and(
                eq(lower(maps.title), title.toLowerCase()),
                ne(maps.status, 'archived')
            ));
        return mapData[0];
    }

    async findMapBySlug(slug: string) {
        const mapData = await db.select()
            .from(maps)
            .where(and(
                eq(maps.slug, slug)
            ));
        return mapData[0];
    }

    async findById(id: number) {
        const mapData = await db.select().from(maps).where(eq(maps.id, id));
        return mapData[0];
    }

    async findAll(page: number, limit: number, filters: any) {

        let queryData: any = db.select({
            id: maps.id,
            title: maps.title,
            slug: maps.slug,
            description: maps.description,
            status: maps.status,
            image: maps.image,
            published_on: maps.published_on,
            published_by: maps.published_by,
            published_by_name: users.name,
            created_at: maps.created_at,
            updated_at: maps.updated_at
        })
            .from(maps)
            .leftJoin(users, eq(maps.published_by, users.id))
            .orderBy(desc(maps.created_at))
            .limit(limit)
            .offset(limit * (page - 1));
        
        // Apply dynamic sorting
        if (filters.sort_by && filters.sort_type) {
            const sortColumn = maps[filters.sort_by];
            const sortOrder = filters.sort_type.toLowerCase() === 'asc' ? asc(sortColumn) : desc(sortColumn);
            queryData = queryData.orderBy(sortOrder);
        } else {
            // Default sorting
            queryData = queryData.orderBy(desc(maps.created_at));
        }

        queryData = filterHelper.maps(queryData, filters);

        return await queryData;
    }

    async findMapsCount(query: any) {
        let countQuery: any = db.select({ count: sql`COUNT(*)` })
            .from(maps)

        countQuery = filterHelper.maps(countQuery, query);
        return countQuery;

    }

    async findMapByTitleAndId(title: string, id: number) {
        const mapData = await db.select()
            .from(maps)
            .where(and(
                eq(lower(maps.title), title.toLowerCase()),
                ne(maps.id, id),
                ne(maps.status, 'archived')
            ))
        return mapData[0];
    }

    async findMapBySlugAndId(slug: string, id: number) {
        const mapData = await db.select()
            .from(maps)
            .where(and(
                eq(lower(maps.slug), slug.toLowerCase()),
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

    async delete(id: number) {
        return await db
            .update(maps)
            .set({ status: 'archived' })
            .where(eq(maps.id, id))
    }

    async updateStatus(id: number, data: any) {
        return await db
            .update(maps)
            .set(data)
            .where(eq(maps.id, id))
    }

    async findStats(filters: any) {
        let countQuery: any = db
            .select({
                status: maps.status,
                count: sql`COUNT(*)`,
            })
            .from(maps)
            .groupBy(maps.status)
        
        countQuery = filterHelper.maps(countQuery, filters);

        return await countQuery;
    }

    async findMapBySlugNotArchived(slug: string) {
        const mapData = await db.select()
            .from(maps)
            .where(and(
                eq(maps.slug, slug),
                ne(maps.status, 'archived')
            ));
        return mapData[0];
    }
}