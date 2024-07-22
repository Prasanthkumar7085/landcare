import { NextRequest, NextResponse } from "next/server";
import { ResponseHelper } from "../helpers/reponseHelper";
import { MarkersDataServiceProvider } from "../services/markersDataServiceProvider";
import { MAP_NOT_FOUND, MARKER_CREATED, MARKER_FETCHED, MARKER_NOT_FOUND_WITH_MAP, MARKER_TITLE_EXISTS, SOMETHING_WENT_WRONG } from "../constants/appMessages";
import { ResourceAlreadyExistsError } from "../helpers/exceptions";
import { MapsDataServiceProvider } from "../services/mapsDataServiceProvider";

const markersDataServiceProvider = new MarkersDataServiceProvider();
const mapsDataServiceProvider = new MapsDataServiceProvider();




export class MarkersController {

    async addMarker(reqData: any,params: any) {

        try {

            reqData.map_id = params.id;

            const mapData = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }   

            const existedMarker = await markersDataServiceProvider.findByTitle(reqData.title);
            if (existedMarker) {
                throw new ResourceAlreadyExistsError('title', MARKER_TITLE_EXISTS);
            }

            const reponseData = await markersDataServiceProvider.create(reqData);
            return ResponseHelper.sendSuccessResponse(200, MARKER_CREATED, reponseData[0]);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
        }

    }

    async getOne(req: NextRequest, params: any) {
        try {

            const mapData = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }  

            const markerData: any = await markersDataServiceProvider.findByIdAndMapId(params.marker_id, params.id);
            if (!markerData) {  
                return ResponseHelper.sendErrorResponse(400, MARKER_NOT_FOUND_WITH_MAP);
            }

            return ResponseHelper.sendSuccessResponse(200, MARKER_FETCHED, markerData);
        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
        }
    }
}