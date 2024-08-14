import { NextRequest } from "next/server";
import { MarkersController } from "../../../../../../../../../../lib/controllers/markersController";

const markersController = new MarkersController();


export async function GET(req: NextRequest, { params }: any) {
    return markersController.getMarkersByCoordinates(params);
}