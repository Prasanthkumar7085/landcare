import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../../../lib/controllers/mapsController";
import { ResponseHelper } from "../../../../../../../lib/helpers/reponseHelper";
import { validate } from "../../../../../../../lib/middlewares/validationMiddlware";
import { UpdateMapStatusSchema } from "../../../../../../../lib/validations/maps/updateStatus";
import { validateAccessToken } from "../../../../../../../lib/middlewares/authMiddleware";
const mapsController = new MapsController();


export async function PATCH(req: NextRequest, { params }: any) {
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }
    // Validate request
    let reqData = await req.json();
    const validationErrors = await validate(UpdateMapStatusSchema, reqData);
    if (validationErrors) {
        return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
    }

    return mapsController.updateStatus(reqData, params,authResult);
}