import { NextRequest, NextResponse } from "next/server";
import {
  ADDRESS_FETCHED,
  COORDINATES_FETCHED,
  COORDINATES_NOT_PROVIDED,
  FETCH_ADDRESS_FAILED,
  FETCH_COORDINATES_FAILED,
  LOCATION_NOT_PROVIDED,
  MAP_CREATED,
  MAP_DELETED,
  MAP_FETCHED,
  MAP_IMAGE_FETCHED,
  MAP_NOT_FOUND,
  MAP_STATUS_UPDATED,
  MAP_TITLE_EXISTS,
  MAP_UPDATED,
  MAPS_FETCHED,
  SOMETHING_WENT_WRONG,
  STATS_FETCHED,
} from "../constants/appMessages";
import { ResourceAlreadyExistsError } from "../helpers/exceptions";
import paginationHelper from "../helpers/paginationHelper";
import { ResponseHelper } from "../helpers/reponseHelper";
import { MapsDataServiceProvider } from "../services/mapsDataServiceProvider";
import { MarkersDataServiceProvider } from "../services/markersDataServiceProvider";
import { makeSlug } from "../utils/app.utils";
import axios from "axios";
import { IMap } from "../interfaces/maps";
import { Client } from "@googlemaps/google-maps-services-js";

const mapsDataServiceProvider = new MapsDataServiceProvider();
const markersDataServiceProvider = new MarkersDataServiceProvider();

export class MapsController {
  async addMap(reqData: IMap, res: NextResponse) {
    try {
      const normalizedTitle = reqData.title.trim().replace(/\s+/g, " ");
      reqData.slug = makeSlug(normalizedTitle);

      const existedMap = await mapsDataServiceProvider.findMapByTitle(normalizedTitle);
      if (existedMap) {
        throw new ResourceAlreadyExistsError("title", MAP_TITLE_EXISTS);
      }

      const existedSlugMap = await mapsDataServiceProvider.findMapBySlug(reqData.slug);
      if (existedSlugMap) {
        if (existedSlugMap.status === "archived") {
          reqData.slug = reqData.slug + "-" + Date.now();
        } else {
          throw new ResourceAlreadyExistsError("title", MAP_TITLE_EXISTS);
        }
      }

      const reponseData = await mapsDataServiceProvider.create(reqData);
      return ResponseHelper.sendSuccessResponse(200, MAP_CREATED, reponseData[0]);
    } catch (error: any) {
      console.error(error);
      if (error.validation_error) {
        return ResponseHelper.sendErrorResponse(409, error.message, error.errors);
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
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async listAll(query: any) {
    try {
      const { page = 1, limit = 10, ...filters } = query;

      if (
        filters.status &&
        filters.status != "active" &&
        filters.status != "publish" &&
        filters.status != "draft"
      ) {
        return ResponseHelper.sendErrorResponse(400, "Invalid status provided in query");
      }

      const [mapsData, mapsCount]: any = await Promise.all([
        mapsDataServiceProvider.findAll(page, limit, filters),
        mapsDataServiceProvider.findMapsCount(filters),
      ]);

      const responseData = paginationHelper.getPaginationResponse({
        page: page,
        count: parseInt(mapsCount[0].count),
        limit: parseInt(limit),
        skip: (page - 1) * limit,
        data: mapsData,
        message: MAPS_FETCHED,
        searchString: query.search_string,
      });

      return NextResponse.json(responseData);
    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async updateOne(reqData: any, params: any) {
    try {
      const normalizedTitle = reqData.title.trim().replace(/\s+/g, " ");
      let slug = makeSlug(normalizedTitle);

      const mapData: any = await mapsDataServiceProvider.findById(params.id);
      if (!mapData) {
        return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
      }

      const existedMap: any = await mapsDataServiceProvider.findMapByTitleAndId(normalizedTitle, params.id);
      if (existedMap) {
        throw new ResourceAlreadyExistsError("title", MAP_TITLE_EXISTS);
      }

      const existedSlug = await mapsDataServiceProvider.findMapBySlugAndId(slug, params.id);
      if (existedSlug) {
        if (existedSlug.status === "archived") {
          reqData.slug = slug + "-" + Date.now();
        } else {
          throw new ResourceAlreadyExistsError("title", MAP_TITLE_EXISTS);
        }
      } else {
        reqData.slug = slug;
      }

      await mapsDataServiceProvider.update(params.id, reqData);
      return ResponseHelper.sendSuccessResponse(200, MAP_UPDATED);
    } catch (error: any) {
      console.error(error);
      if (error.validation_error) {
        return ResponseHelper.sendErrorResponse(409, error.message, error.errors);
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
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async updateStatus(reqData: any, params: any, user: any) {
    try {
      const mapData: any = await mapsDataServiceProvider.findById(params.id);
      if (!mapData) {
        return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
      }

      if (reqData.status === "publish") {
        reqData.published_on = new Date();
        reqData.published_by = user.id;
      }

      await mapsDataServiceProvider.updateStatus(params.id, reqData);

      return ResponseHelper.sendSuccessResponse(200, MAP_STATUS_UPDATED);
    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async getMapStaticImage(reqData: any) {
    try {
      const markers = reqData?.markers;
      const markerString = markers
        .map((marker: any) => `markers=color:red|${marker[0]},${marker[1]}`)
        .join("&");
      const coordinates = reqData.coordinates;
      const path = coordinates
        .map((coord: any) => `${coord.lat},${coord.lng}`)
        .join("|");
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=fillcolor:0x33333333|color:0x000000ff|weight:2|${path}&${markerString}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

      const response: any = await axios.get(mapUrl, {
        responseType: "arraybuffer",
      });
      const base64Image = Buffer.from(response.data, "binary").toString(
        "base64"
      );

      return ResponseHelper.sendSuccessResponse(200, MAP_IMAGE_FETCHED, `data:image/png;base64,${base64Image}`);
    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async getMapBySlug(params: any) {
    try {
      const mapData: any = await mapsDataServiceProvider.findMapBySlugNotArchived(params.slug);
      if (!mapData) {
        return ResponseHelper.sendErrorResponse(400, MAP_NOT_FOUND);
      }

      return ResponseHelper.sendSuccessResponse(200, MAP_FETCHED, mapData);
    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async getStats(query: any) {
    try {
      const stats = await mapsDataServiceProvider.findStats(query);
      return ResponseHelper.sendSuccessResponse(200, STATS_FETCHED, stats);
    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async  getCoordinates(query: any) {
    try {

      if (!query || !query.location) {
        return ResponseHelper.sendErrorResponse(400, LOCATION_NOT_PROVIDED,{});
      }

      const client = new Client({});
      const response = await client.geocode({
        params: {
          address: query.location,
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
        },
      });

      let coordinates;
      if (response.data.status === "OK") {
        coordinates = response.data.results[0].geometry.location;
      } else {
        return ResponseHelper.sendErrorResponse(400, FETCH_COORDINATES_FAILED,{});
      }

      return ResponseHelper.sendSuccessResponse(200, COORDINATES_FETCHED, coordinates);

    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }

  async  getAddress(query: any) {
    try {

      if (!query || (!query.lat && !query.lng)) {
        return ResponseHelper.sendErrorResponse(400, COORDINATES_NOT_PROVIDED, {});
      }

      const client = new Client({});
      const response = await client.geocode({
        params: {
          address: `${query.lat},${query.lng}`,
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
        },
      });

      let coordinates;
      if (response.data.status === "OK") {
        coordinates = response.data.results[0]
      } else {
        return ResponseHelper.sendErrorResponse(400, FETCH_ADDRESS_FAILED,{});
      }

      return ResponseHelper.sendSuccessResponse(200, ADDRESS_FETCHED, coordinates);

    } catch (error: any) {
      console.error(error);
      return ResponseHelper.sendErrorResponse(500, error.message || SOMETHING_WENT_WRONG, error);
    }
  }
}
