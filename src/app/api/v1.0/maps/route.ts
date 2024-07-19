import { NextRequest, NextResponse } from "next/server";
import { MapsController } from "../../../../../lib/controllers/mapsController";
const mapsController = new MapsController();


export async function POST(req: NextRequest, res: NextResponse) {
    return mapsController.addMap(req, res);
}