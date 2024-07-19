import { NextRequest, NextResponse } from "next/server";
import { ResponseHelper } from "../helpers/reponseHelper";
import { MapsDataServiceProvider } from "../services/mapsDataServiceProvider";
import { MAP_CREATED, MAP_FETCHED, MAP_TITLE_EXISTS, SOMETHING_WENT_WRONG } from "../constants/appMessages";
import { makeSlug } from "../utils/app.utils";
import { ResourceAlreadyExistsError } from "../helpers/exceptions";

const mapsDataServiceProvider = new MapsDataServiceProvider();



export class MapsController {

    async addMap(req: NextRequest, res: NextResponse) {
        try {

            const reqData = await req.json();
            reqData.slug = makeSlug(reqData.title);

            const existedMapTitle = await mapsDataServiceProvider.findMapByTitle(reqData.title);
            if (existedMapTitle) {
                throw new ResourceAlreadyExistsError('title', MAP_TITLE_EXISTS);
            }

            const reponseData = await mapsDataServiceProvider.create(reqData);
            return ResponseHelper.sendSuccessResponse(200, MAP_CREATED, reponseData[0]);

        } catch (error: any) {
            console.log(error);
            if (error.validation_error) {
                return ResponseHelper.sendErrorResponse(422, error.message, error.errors);
            }
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
        }
    }

    async getOne(req: NextRequest, params: any) {
        try {

            const responseData: any = await mapsDataServiceProvider.findById(params.id);

            return ResponseHelper.sendSuccessResponse(200, MAP_FETCHED, responseData);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
        }
    }
}