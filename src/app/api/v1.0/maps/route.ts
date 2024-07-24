import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../lib/controllers/mapsController";
import { ResponseHelper } from "../../../../../lib/helpers/reponseHelper";
import { validate } from "../../../../../lib/middlewares/validationMiddlware";
import { AddMapSchema } from "../../../../../lib/validations/maps/addMap";
import { validateAccessToken} from "../../../../../lib/middlewares/authMiddleware";

const mapsController = new MapsController();


export async function POST(req: NextRequest, res: NextResponse) {
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
    
    return mapsController.addMap(reqData, res);
}

export async function GET(req: NextRequest) {
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));

    return mapsController.listAll(query);
}