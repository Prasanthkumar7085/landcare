import * as v from 'valibot';

enum Status{
    draft = 'draft',
    active = 'active',
    publish = 'publish',
    inactive = 'inactive',
    archived = 'archived'
}
  
export const AddMapSchema = v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    description: v.nullish(v.string()),
    status: v.nullish(v.enum(Status)),
    geo_type: v.nullish(v.string()),
    geo_coordinates: v.optional(v.array(v.array(v.number()))),
    geo_zoom: v.nullish(v.number()),
    image: v.nullish(v.string()),
});
  