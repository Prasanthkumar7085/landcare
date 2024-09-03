import * as v from 'valibot';

export const AddMarkerSchema = v.object({
    name: v.pipe(v.string(), v.nonEmpty()),
    description: v.nullish(v.string()),
    landcare_region: v.nullish(v.string()),
    host: v.nullish(v.string()),
    host_type: v.nullish(v.string()),
    type: v.pipe(v.string(), v.nonEmpty()),

    street_address: v.nullish(v.string()),
    town: v.nullish(v.string()),
    postcode: v.nullish(v.string()),
    coordinates: v.nullish(v.array(v.number())),

    phone_number: v.nullish(v.string()),
    email: v.nullish(v.pipe(v.string(), v.email())),
    website: v.nullish(v.pipe(v.string(), v.url())),
    fax: v.nullish(v.string()),
    contact: v.nullish(v.string()),

    image: v.nullish(v.string()),
    tags: v.optional(v.array(v.string())),
    facebook: v.nullish(v.pipe(v.string(), v.url())),
    twitter: v.nullish(v.pipe(v.string(), v.url())),
    instagram: v.nullish(v.pipe(v.string(), v.url())),
    youtube: v.nullish(v.pipe(v.string(), v.url())),

    status: v.nullish(v.boolean()),

});
