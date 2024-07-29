import * as v from 'valibot';


export const AddStaticImageSchema = v.object({
    coordinates: v.pipe(v.array(v.object({ lat: v.number(), lng: v.number() })), v.nonEmpty()),
});