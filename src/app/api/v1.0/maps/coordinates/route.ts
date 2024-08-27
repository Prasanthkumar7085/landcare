import { NextRequest } from "next/server";
import { MapsController } from "../../../../../../lib/controllers/mapsController";

const mapsController = new MapsController();




export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));

    return mapsController.getCoordinates(query);
}