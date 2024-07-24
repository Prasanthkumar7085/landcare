import { NextRequest } from "next/server";
import { MarkersController } from "../../../../../../../../lib/controllers/markersController";
import { ResponseHelper } from "../../../../../../../../lib/helpers/reponseHelper";
import { AddMarkerSchema } from "../../../../../../../../lib/validations/markers/addMarker";
import { validate } from "../../../../../../../../lib/middlewares/validationMiddlware";
import { validateAccessToken } from "../../../../../../../../lib/middlewares/authMiddleware";

const markersController = new MarkersController();


export async function GET(req: NextRequest, { params }: any) { 
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }

    return markersController.getOne(req,params);
}

export async function PATCH(req: NextRequest, { params }: any) { 
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }
    // Validate request
    const reqData = await req.json();
    const validationErrors = await validate(AddMarkerSchema, reqData);
    if (validationErrors) {
        return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
    }
   
    return markersController.update(reqData, params);
}


export async function DELETE(req: NextRequest, { params }: any) {
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }
    
    return markersController.delete(req, params);
}