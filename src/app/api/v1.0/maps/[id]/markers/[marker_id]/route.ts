import { NextRequest } from "next/server";
import { MarkersController } from "../../../../../../../../lib/controllers/markersController";
import { ResponseHelper } from "../../../../../../../../lib/helpers/reponseHelper";

const markersController = new MarkersController();


export async function GET(req: NextRequest, { params }: any) { 
    return markersController.getOne(req,params);
}