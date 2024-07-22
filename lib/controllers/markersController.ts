import { NextRequest, NextResponse } from "next/server";
import { ResponseHelper } from "../helpers/reponseHelper";
import { MarkersDataServiceProvider } from "../services/markersDataServiceProvider";
import { MAP_NOT_FOUND, MARKER_CREATED, MARKER_DELETED, MARKER_FETCHED, MARKER_NOT_FOUND_WITH_MAP, MARKER_TITLE_EXISTS, MARKER_UPDATED, MARKERS_FETCHED, SOMETHING_WENT_WRONG } from "../constants/appMessages";
import { ResourceAlreadyExistsError } from "../helpers/exceptions";
import { MapsDataServiceProvider } from "../services/mapsDataServiceProvider";
import filterHelper from "../helpers/filterHelper";
import paginationHelper from "../helpers/paginationHelper";

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

            const existedMarker = await markersDataServiceProvider.findByTitle(reqData.title);
            if (existedMarker) {
                throw new ResourceAlreadyExistsError('title', MARKER_TITLE_EXISTS);
            }

            const reponseData = await markersDataServiceProvider.create(reqData);
            return ResponseHelper.sendSuccessResponse(200, MARKER_CREATED, reponseData[0]);

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

    async listMarkers(query: any, params: any) {
        try {

            const mapId = params.id;
            const mapData = await mapsDataServiceProvider.findById(mapId);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            const { page = 1, limit = 10, ...filteredQuery } = query;

            const [markersData, markerCount]: any = await Promise.all([
                markersDataServiceProvider.findAllByMapId(page, limit, mapId, filteredQuery),
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
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
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

            await markersDataServiceProvider.update(markerId, reqData);

            return ResponseHelper.sendSuccessResponse(200, MARKER_UPDATED);

        } catch (error: any) {
            console.log(error);
            if (error.validation_error) {
                return ResponseHelper.sendErrorResponse(422, error.message, error.errors);
            }
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
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
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG, error);
        }
    }
}