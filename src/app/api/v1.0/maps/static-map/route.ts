import { NextRequest } from "next/server";
import { MapsController } from "../../../../../../lib/controllers/mapsController";

const mapsController = new MapsController();



export async function POST(req: NextRequest) {
    return mapsController.getMapStaticImage(req);
}