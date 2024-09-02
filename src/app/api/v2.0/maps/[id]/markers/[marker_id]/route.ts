import { NextRequest } from "next/server";
import { MarkersController } from "../../../../../../../../lib/controllers/markersController";
import { ResponseHelper } from "../../../../../../../../lib/helpers/reponseHelper";
import { validate } from "../../../../../../../../lib/middlewares/validationMiddlware";
import { AddMarkerSchema } from "../../../../../../../../lib/validations/markers/addMarker";

const markersController = new MarkersController();


export async function GET(req: NextRequest, { params }: any) { 
    return markersController.getOne(req,params);
}

export async function PATCH(req: NextRequest, { params }: any) { 
    // Validate request
    const reqData = await req.json();
    const validationErrors = await validate(AddMarkerSchema, reqData);
    if (validationErrors) {
        return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
    }
   
    return markersController.update(reqData, params);
}


export async function DELETE(req: NextRequest, { params }: any) {
    return markersController.delete(req, params);
}