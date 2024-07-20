import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../../../lib/controllers/mapsController";
const mapsController = new MapsController();


export async function PATCH(req: NextRequest, { params }: any) {
    return mapsController.updateStatus(req, params);
}