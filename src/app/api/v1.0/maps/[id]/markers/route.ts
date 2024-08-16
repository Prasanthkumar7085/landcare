import { NextRequest, NextResponse } from "next/server";
import { MarkersController } from "../../../../../../../lib/controllers/markersController";
import { validate } from "../../../../../../../lib/middlewares/validationMiddlware";
import { AddMarkerSchema } from "../../../../../../../lib/validations/markers/addMarker";
import { ResponseHelper } from "../../../../../../../lib/helpers/reponseHelper";
import { validateAccessToken } from "../../../../../../../lib/middlewares/authMiddleware";

const markersController = new MarkersController();


export async function POST(req: NextRequest, { params }: any) {
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
    
    return markersController.addMarker(reqData, params);
}   

export async function GET(req: NextRequest, { params }: any) {
       
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));
    
    return markersController.listMarkers(query, params);
}

export async function DELETE(req: NextRequest, { params }: any) {
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }
    
    return markersController.deleteMarkersByMapId(params);
}