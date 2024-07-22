import { NextRequest, NextResponse } from "next/server";
import { MarkersController } from "../../../../../../../../lib/controllers/markersController";
import { AddMarkerSchema } from "../../../../../../../../lib/validations/markers/addMarker";
import { validate } from "../../../../../../../../lib/middlewares/validationMiddlware";
import { ResponseHelper } from "../../../../../../../../lib/helpers/reponseHelper";
const markersController = new MarkersController();


export async function POST(req: NextRequest, { params }: any) {
    // Validate request
    const reqData = await req.json();
    for (const marker of reqData) {
        const validationErrors = await validate(AddMarkerSchema, marker);
        if (validationErrors) {
            return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
        }
    }
    
    return markersController.addBulkMarkers(reqData, params);
}