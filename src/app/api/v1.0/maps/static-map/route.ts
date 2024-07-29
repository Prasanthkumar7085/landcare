import { NextRequest } from "next/server";
import { MapsController } from "../../../../../../lib/controllers/mapsController";
import { validate } from "../../../../../../lib/middlewares/validationMiddlware";
import { ResponseHelper } from "../../../../../../lib/helpers/reponseHelper";
import { AddStaticImageSchema } from "../../../../../../lib/validations/maps/addStaticImage";

const mapsController = new MapsController();



export async function POST(req: NextRequest) {
    const reqData = await req.json();
    const validationErrors = await validate(AddStaticImageSchema, reqData);
    if (validationErrors) {
        return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
    }
    return mapsController.getMapStaticImage(reqData);
}