import { NextRequest } from "next/server";
import { MarkersController } from "../../../../../../../../lib/controllers/markersController";
import { validateAccessToken } from "../../../../../../../../lib/middlewares/authMiddleware";
const markersController = new MarkersController();


export async function POST(req: NextRequest, { params }: any) {
   //Check authorization
   const authResult: any = await validateAccessToken(req);
   if (authResult.status === 403) {
       return authResult
    }
    
    return markersController.addBulkMarkers(req, params);
}