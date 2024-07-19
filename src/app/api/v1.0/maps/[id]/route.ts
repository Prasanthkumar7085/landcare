import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../../lib/controllers/mapsController";
const mapsController = new MapsController();


export async function GET(req: NextRequest, { params }: any) {
    return mapsController.getOne(req,params);
}

export async function PATCH(req: NextRequest, { params }: any) {
    return mapsController.updateOne(req, params);
}