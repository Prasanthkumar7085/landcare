import * as v from 'valibot';
  
export const AddMarkerSchema = v.object({
    title: v.nullish(v.string()),
    description: v.nullish(v.string()),
    organisation_type: v.nullish(v.string()),
    coordinates: v.nullish(v.array(v.number())),
    color_code: v.nullish(v.string()),

    postal_address: v.nullish(v.string()),
    street_address: v.nullish(v.string()),
    town: v.nullish(v.string()),
    postcode: v.nullish(v.string()),

    phone: v.nullish(v.string()),
    email: v.nullish(v.pipe(v.string(), v.email())),
    website: v.nullish(v.string()),
    fax: v.nullish(v.string()),
    contact: v.nullish(v.string()),
    
    images: v.nullish(v.array(v.string())),
    tags: v.nullish(v.array(v.string())),
    social_links: v.nullish(v.array(v.string())),

    added_by: v.nullish(v.string()),
    status: v.nullish(v.boolean()),
    
});
  