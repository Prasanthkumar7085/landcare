import * as v from 'valibot';
  
export const AddMarkerSchema = v.object({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    organisation_type: v.optional(v.string()),
    coordinates: v.optional(v.array(v.number())),
    color_code: v.optional(v.string()),

    postal_address: v.optional(v.string()),
    street_address: v.optional(v.string()),
    town: v.optional(v.string()),
    postcode: v.optional(v.string()),

    phone: v.optional(v.string()),
    email: v.optional(v.pipe(v.string(), v.email())),
    website: v.optional(v.string()),
    fax: v.optional(v.string()),
    contact: v.optional(v.string()),
    
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    social_links: v.optional(v.array(v.string())),

    added_by: v.optional(v.string()),
    status: v.optional(v.boolean()),
    
});
  