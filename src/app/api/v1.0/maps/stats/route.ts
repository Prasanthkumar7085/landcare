import { NextRequest } from "next/server";
import { validateAccessToken } from "../../../../../../lib/middlewares/authMiddleware";
import { MapsController } from "../../../../../../lib/controllers/mapsController";
const mapsController = new MapsController();

export async function GET(req: NextRequest) {
    //Check authorization
    const authResult: any = await validateAccessToken(req);
    if (authResult.status === 403) {
        return authResult
    }

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(new URLSearchParams(Array.from(searchParams.entries())));

    return mapsController.getStats(query);
}
