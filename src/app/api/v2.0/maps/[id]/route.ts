import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../../lib/controllers/mapsController";
import { ResponseHelper } from "../../../../../../lib/helpers/reponseHelper";
import { validate } from "../../../../../../lib/middlewares/validationMiddlware";
import { AddMapSchema } from "../../../../../../lib/validations/maps/addMap";
import { validateAccessToken } from "../../../../../../lib/middlewares/authMiddleware";
const mapsController = new MapsController();


export async function GET(req: NextRequest, { params }: any) {
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }
    
    return mapsController.getOne(req,params);
}

export async function PATCH(req: NextRequest, { params }: any) {
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }
     // Validate request
     const reqData = await req.json();
     const validationErrors = await validate(AddMapSchema, reqData);
     if (validationErrors) {
         return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
     }
    return mapsController.updateOne(reqData, params);
}

export async function DELETE(req: NextRequest, { params }: any) {
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }
    return mapsController.deleteOne(req, params);
}