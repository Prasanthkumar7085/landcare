import { NextRequest, NextResponse } from "next/server";
import { MAP_CREATED, MAP_DELETED, MAP_FETCHED, MAP_NOT_FOUND, MAP_STATUS_UPDATED, MAP_TITLE_EXISTS, MAP_UPDATED, MAPS_FETCHED, SOMETHING_WENT_WRONG } from "../constants/appMessages";
import { ResourceAlreadyExistsError } from "../helpers/exceptions";
import paginationHelper from "../helpers/paginationHelper";
import { ResponseHelper } from "../helpers/reponseHelper";
import { MapsDataServiceProvider } from "../services/mapsDataServiceProvider";
import { MarkersDataServiceProvider } from "../services/markersDataServiceProvider";
import { makeSlug } from "../utils/app.utils";
import axios from "axios";

const mapsDataServiceProvider = new MapsDataServiceProvider();
const markersDataServiceProvider = new MarkersDataServiceProvider();



export class MapsController {

    async addMap(reqData: any, res: NextResponse) {
        try {

            reqData.slug = makeSlug(reqData.title);

            const existedMap = await mapsDataServiceProvider.findMapByTitle(reqData.title);
            if (existedMap) {
                throw new ResourceAlreadyExistsError('title', MAP_TITLE_EXISTS);
            }

            const reponseData = await mapsDataServiceProvider.create(reqData);
            return ResponseHelper.sendSuccessResponse(200, MAP_CREATED, reponseData[0]);

        } catch (error: any) {
            console.log(error);
            if (error.validation_error) {
                return ResponseHelper.sendErrorResponse(422, error.message, error.errors);
            }
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async getOne(req: NextRequest, params: any) {
        try {

            const mapData: any = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            return ResponseHelper.sendSuccessResponse(200, MAP_FETCHED, mapData);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async listAll(query: any) {
        try {

            const { page = 1, limit = 10, ...filters } = query;

            if (filters.status && (filters.status != 'active' && filters.status != 'publish' && filters.status != 'draft')) {
                return ResponseHelper.sendErrorResponse(400, 'Invalid status provided in query');
            }

            const [mapsData, mapsCount]: any = await Promise.all([
                mapsDataServiceProvider.findAll(page, limit, filters),
                mapsDataServiceProvider.findMapsCount(filters)
            ]);

            const responseData = paginationHelper.getPaginationResponse({
                page: page,
                count: parseInt(mapsCount[0].count),
                limit: parseInt(limit),
                skip: (page - 1) * limit,
                data: mapsData,
                message: MAPS_FETCHED,
                searchString: query.search_string
            });

            return NextResponse.json(responseData);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async updateOne(reqData: any, params: any) {
        try {

            let slug = makeSlug(reqData.title);

            const mapData: any = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            const existedMap: any = await mapsDataServiceProvider.findMapByTitleAndId(reqData.title, params.id);
            if (existedMap) {
                throw new ResourceAlreadyExistsError('title', MAP_TITLE_EXISTS);
            }

            const existedSlug = await mapsDataServiceProvider.findMapBySlugAndId(slug, params.id);
            if (existedSlug) {
                reqData.slug = slug + '' + Date.now();
            } else {
                reqData.slug = slug;
            }

            await mapsDataServiceProvider.update(params.id, reqData);

            return ResponseHelper.sendSuccessResponse(200, MAP_UPDATED);

        } catch (error: any) {
            console.log(error);
            if (error.validation_error) {
                return ResponseHelper.sendErrorResponse(422, error.message, error.errors);
            }
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async deleteOne(req: NextRequest, params: any) {
        try {

            const mapData: any = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            await mapsDataServiceProvider.delete(params.id);
            // await markersDataServiceProvider.deleteByMapId(params.id);

            return ResponseHelper.sendSuccessResponse(200, MAP_DELETED);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async updateStatus(reqData: any, params: any, user: any) {
        try {

            const mapData: any = await mapsDataServiceProvider.findById(params.id);
            if (!mapData) {
                return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
            }

            if (reqData.status === 'publish') {
                reqData.published_on = new Date();
                reqData.published_by = user.id;
            }

            await mapsDataServiceProvider.updateStatus(params.id, reqData);

            return ResponseHelper.sendSuccessResponse(200, MAP_STATUS_UPDATED);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }

    async getMapStaticImage(reqData: any) {

        try {
            const coordinates = reqData.coordinates;
            const path = coordinates.map((coord: any) => `${coord.lat},${coord.lng}`).join('|');
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=fillcolor:0x33333333|color:0x000000ff|weight:2|${path}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

            const response: any = await axios.get(mapUrl, { responseType: 'arraybuffer' });
            const base64Image = Buffer.from(response.data, 'binary').toString('base64');

            return ResponseHelper.sendSuccessResponse(200, 'Map image fetched', `data:image/png;base64,${base64Image}`);

        } catch (error: any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
        }
    }
}