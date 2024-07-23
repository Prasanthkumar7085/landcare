import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../lib/controllers/mapsController";
import { ResponseHelper } from "../../../../../lib/helpers/reponseHelper";
import { validate } from "../../../../../lib/middlewares/validationMiddlware";
import { AddMapSchema } from "../../../../../lib/validations/maps/addMap";
import { hasAccessToken, validToken, validUser } from "../../../../../lib/middlewares/authMiddleware";

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
    const token = req.headers.get("Authorization");
    //Check Token Provided or not
    const isToken = await hasAccessToken(token);
    if (!isToken) {
        return ResponseHelper.sendErrorResponse(403, 'Access Denied: No Token Provided');   
    }
    //Check Token is valid or not
    const isValidToken: any = await validToken(token);
    if (!isValidToken) {
        return ResponseHelper.sendErrorResponse(403, 'Access Denied: Invalid Token');
    }
    //Check User is valid or not
    const user = await validUser(token);
    if (!user) {
        return ResponseHelper.sendErrorResponse(403, 'Access Denied: Invalid User');
    }

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));

    return mapsController.listAll(query);
}