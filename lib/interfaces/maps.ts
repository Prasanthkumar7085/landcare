

export interface IMap{
    id?:number,

    title: string,
    slug: string,
    description: string,

    status: string,
    published_on?: Date,
    published_by?: number,

    geo_type: string,
    geo_coordinates?: number[],
    geo_zoom?: number,
    image?: string,

    created_at?: Date,
    updated_at?: Date
}