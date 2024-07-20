import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../lib/controllers/mapsController";
import { ResponseHelper } from "../../../../../lib/helpers/reponseHelper";
import { validate } from "../../../../../lib/middlewares/validationMiddlware";
import { AddMapSchema } from "../../../../../lib/validations/maps/addMap";
const mapsController = new MapsController();


export async function POST(req: NextRequest, res: NextResponse) {
    // Validate request
    const reqData = await req.json();
    const validationErrors = await validate(AddMapSchema, reqData);
    if (validationErrors) {
        return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
    }
    
    return mapsController.addMap(reqData, res);
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));

    return mapsController.listAll(query);
}