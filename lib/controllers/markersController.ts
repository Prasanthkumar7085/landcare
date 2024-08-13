import { NextRequest, NextResponse } from "next/server";
import { MAP_NOT_FOUND, MARKER_CREATED, MARKER_DELETED, MARKER_FETCHED, MARKER_NOT_FOUND_WITH_MAP, MARKER_TITLE_EXISTS, MARKER_UPDATED, MARKERS_FETCHED, MARKERS_IMPORTED, SOMETHING_WENT_WRONG } from "../constants/appMessages";
import paginationHelper from "../helpers/paginationHelper";
import { ResponseHelper } from "../helpers/reponseHelper";
import { MapsDataServiceProvider } from "../services/mapsDataServiceProvider";
import { MarkersDataServiceProvider } from "../services/markersDataServiceProvider";
import { ResourceAlreadyExistsError } from "../helpers/exceptions";

const markersDataServiceProvider = new MarkersDataServiceProvider();
const mapsDataServiceProvider = new MapsDataServiceProvider();




export class MarkersController {

    async addMarker(reqData: any, params: any) {

        try {

            reqData.map_id = params.id;

            const mapData = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            const existedMarker = await markersDataServiceProvider.findByTitleAndMapId(reqData.title, params.id);
            if (existedMarker) {
                throw new ResourceAlreadyExistsError('title', MARKER_TITLE_EXISTS);
            }

            const reponseData = await markersDataServiceProvider.create(reqData);
            return ResponseHelper.sendSuccessResponse(200, MARKER_CREATED, reponseData[0]);

        } catch (error: any) {
            console.log(error);
            if (error.validation_error) {
                return ResponseHelper.sendErrorResponse(409, error.message, error.errors);
            }
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }

    }

    async addBulkMarkers(req: NextRequest, params: any) {
        try {

            let reqData = await req.json();
            reqData.map((map: any) => {
                map.map_id = params.id
            })

            const mapData = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            await markersDataServiceProvider.create(reqData);

            return ResponseHelper.sendSuccessResponse(200, MARKERS_IMPORTED);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
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
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async listMarkers(query: any, params: any) {
        try {

            const mapId = params.id;
            const mapData = await mapsDataServiceProvider.findById(mapId);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            let { page = 1, limit = 10, ...filteredQuery } = query;

            let skip = (page - 1) * limit;
            if (filteredQuery.get_all) {
                limit = 0;
                skip = 0
            }

            const [markersData, markerCount]: any = await Promise.all([
                markersDataServiceProvider.findAllByMapId(skip, limit, mapId, filteredQuery),
                markersDataServiceProvider.findMarkersCount(filteredQuery, mapId)
            ])

            const responseData = paginationHelper.getPaginationResponse({
                page: page,
                count: parseInt(markerCount[0].count),
                limit: parseInt(limit),
                skip: (page - 1) * limit,
                data: markersData,
                message: MARKERS_FETCHED,
                searchString: query.search_string
            });

            return NextResponse.json(responseData);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async update(reqData: any, params: any) {

        try {
            const mapId = params.id;
            const markerId = params.marker_id;
            const mapData = await mapsDataServiceProvider.findById(mapId);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            const markerData: any = await markersDataServiceProvider.findByIdAndMapId(markerId, mapId);
            if (!markerData) {
                return ResponseHelper.sendErrorResponse(400, MARKER_NOT_FOUND_WITH_MAP);
            }

            const existedMarker = await markersDataServiceProvider.findByTitleAndId(reqData.title, markerId, mapId);
            if (existedMarker) {
                throw new ResourceAlreadyExistsError('title', MARKER_TITLE_EXISTS);
            }

            const updatedData = await markersDataServiceProvider.update(markerId, reqData);

            return ResponseHelper.sendSuccessResponse(200, MARKER_UPDATED, updatedData[0]);

        } catch (error: any) {
            console.log(error);
            if (error.validation_error) {
                return ResponseHelper.sendErrorResponse(409, error.message, error.errors);
            }
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async delete(req: NextRequest, params: any) {
        try {

            const mapId = params.id;
            const markerId = params.marker_id;

            const mapData: any = await mapsDataServiceProvider.findById(mapId);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            const markerData: any = await markersDataServiceProvider.findByIdAndMapId(markerId, mapId);
            if (!markerData) {
                return ResponseHelper.sendErrorResponse(400, MARKER_NOT_FOUND_WITH_MAP);
            }

            await markersDataServiceProvider.delete(markerId);

            return ResponseHelper.sendSuccessResponse(200, MARKER_DELETED);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }
}