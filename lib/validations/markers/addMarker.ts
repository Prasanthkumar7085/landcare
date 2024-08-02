import * as v from 'valibot';
  
export const AddMarkerSchema = v.object({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.boolean()),
    type: v.optional(v.string()),
    full_address: v.optional(v.string()),
    state: v.optional(v.string()),
    city: v.optional(v.string()),
    zipcode: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    social_links: v.optional(v.array(v.string())),
    added_by: v.optional(v.string()),
    coordinates: v.optional(v.array(v.number())),
    color_code: v.optional(v.string()),
    name: v.optional(v.string()),
    position: v.optional(v.string()),
    host_organization: v.optional(v.string()),
    lls_region: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    location: v.optional(v.string()),
    post_code: v.optional(v.string()),
});
  