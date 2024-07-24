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
    description: v.optional(v.string()),
    status: v.optional(v.enum(Status)),
    geo_type: v.optional(v.string()),
    geo_coordinates: v.pipe(v.array(v.array(v.number())), v.nonEmpty()),
    geo_zoom: v.optional(v.number()),
    image: v.optional(v.string()),
});
  