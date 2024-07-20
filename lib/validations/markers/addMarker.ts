import * as v from 'valibot';

enum Status{
    true = 'true',
    false = 'false'
}
  
export const AddMarkerSchema = v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    description: v.optional(v.string()),
    status: v.optional(v.enum(Status)),
    type: v.pipe(v.string(), v.nonEmpty()),
    full_address: v.pipe(v.string(), v.nonEmpty()),
    state: v.optional(v.string()),
    city: v.optional(v.string()),
    zipcode: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    social_links: v.optional(v.array(v.string())),
    added_by: v.optional(v.string()),
    coordinates: v.pipe(v.array(v.number()), v.nonEmpty()),
});
  