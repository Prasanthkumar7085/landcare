import { toast } from "sonner";
import {
  markersImages,
  SheetHeaders,
  subHeadersMappingConstants,
} from "../constants/mapConstants";
import { getStaticMapAPI, updateMapWithCordinatesAPI } from "@/services/maps";

export const calculatePolygonCentroid = (coordinates: any) => {
  let x = 0,
    y = 0;
  for (let i = 0; i < coordinates?.length; i++) {
    x += coordinates[i][0];
    y += coordinates[i][1];
  }
  return { lat: x / coordinates?.length, lng: y / coordinates?.length };
};

export const checkSheetHeaders = (headers: any) => {
  if (headers?.length == SheetHeaders?.length) {
    if (headers?.every((header: any) => SheetHeaders?.includes(header))) {
      return true;
    }
  }
  return false;
};
export const processImportedData = (parsedData: any) => {
  const isEmpty = parsedData.every((row: any) =>
    row.every((cell: any) => String(cell).trim() === "")
  );
  const arraysEqual = (a: any, b: any) =>
    a.length === b.length &&
    a
      .slice()
      .sort()
      .every((item: any, index: number) => item === b.slice().sort()[index]);

  if (isEmpty) {
    toast.warning("File is empty!");
    return false;
  } else if (parsedData?.length == 1) {
    toast.warning("File contains empty data!");
    return false;
  } else {
    return true;
  }
};

const parseField = (value: any, type: string) => {
  if (!value)
    return type == "coordinates" || type == "tags" || type == "images"
      ? []
      : "";

  switch (type) {
    case "coordinates":
      return value?.split(",").map((coord: string) => parseFloat(coord.trim()));
    case "postcode":
      return value.toString();
    case "town":
      return value ? value + " " + "Australia" : "";
    case "tags":
    case "images":
      return value ? value?.split(",").map((item: string) => item.trim()) : [];
    default:
      return value;
  }
};

const parseRows = (rows: any[], headers: any[]) => {
  return rows.map((row: any) => {
    let obj: any = {};
    headers.forEach((headerName: any, i: any) => {
      const mappedItem = subHeadersMappingConstants[headerName];
      const value = row[i];
      obj[mappedItem] = parseField(value?.toString(), mappedItem);
    });
    return obj;
  });
};

const fetchTownCoordinates = async (townsToFetch: string[]) => {
  const townCoordinatesPromises = townsToFetch.map(async (town: string) => {
    try {
      const coords = await getCoordinates(town);
      return { town, coords, error: null };
    } catch (error) {
      return { town, coords: null, error };
    }
  });

  return Promise.allSettled(townCoordinatesPromises);
};

const updateDataWithCoordinates = (
  filteredDataObjects: any[],
  locationToCoordinatesMap: any,
  locationErrorsMap: any
) => {
  const updatedData: any = [];
  const coordinatesErrors: any = [];
  filteredDataObjects.forEach((obj: any) => {
    if (isValidCoordinates(obj.coordinates)) {
      const coords = obj.coordinates;
      if (coords && obj?.title) {
        updatedData.push({
          ...obj,
          coordinates: coords,
        });
      }
    } else if (obj.town && isValidCoordinates(obj.coordinates) == false) {
      const coords = locationToCoordinatesMap[obj.town] || null;
      if (coords && obj?.title) {
        updatedData.push({
          ...obj,
          coordinates: coords,
        });
      } else if (locationErrorsMap[obj.town]) {
        coordinatesErrors.push({
          ...obj,
          error: locationErrorsMap[obj.town],
        });
      }
    }
  });
  return [updatedData, coordinatesErrors];
};

export const getImportedFilteredData = async ({ jsonData }: any) => {
  const headers: any =
    jsonData[0]?.length > 15 ? jsonData[0].slice(0, 15) : jsonData[0];
  const rows: any = jsonData.slice(1);
  console.log(jsonData, "Fdasfdsaasfads");

  const dataObjects = parseRows(rows, headers);
  const filteredDataObjects = dataObjects.filter((obj: any) => {
    const values = Object.values(obj);
    return !values.every(
      (value) =>
        value == undefined || value == "" || value == null || value == " "
    );
  });
  let errorsData = validationsForImportedData({ filteredDataObjects });
  let data = [...errorsData.validData];
  let locationToCoordinatesMap: any = {};
  let townsToFetch: any = [];
  data.forEach((obj: any) => {
    if (
      isValidCoordinates(obj.coordinates) == false &&
      obj.town &&
      !townsToFetch.includes(obj.town)
    ) {
      townsToFetch.push(obj.town);
    }
  });

  const townCoordinatesResults = await fetchTownCoordinates(townsToFetch);

  let locationErrorsMap: { [key: string]: string } = {};

  townCoordinatesResults.forEach((result: any) => {
    if (result.status === "fulfilled") {
      const { town, coords, error } = result.value;
      if (!error) {
        locationToCoordinatesMap[town] = coords;
      } else {
        locationErrorsMap[town] = "Failed to fetch coordinates";
      }
    } else {
      console.error("Promise rejected:", result.reason);
    }
  });

  const [updatedData, coordinatesErrors] = updateDataWithCoordinates(
    data,
    locationToCoordinatesMap,
    locationErrorsMap
  );
  return [updatedData, [...errorsData.errors, ...coordinatesErrors]];
};

interface DataObject {
  title?: string;
  coordinates?: any;
  town?: string;
}

const isValidCoordinates = (coords: any): boolean => {
  if (!Array.isArray(coords)) return false;
  if (coords.length === 0) return false;
  return coords.every((coord) => typeof coord === "number" && !isNaN(coord));
};

const validationsForImportedData = ({
  filteredDataObjects,
}: {
  filteredDataObjects: DataObject[];
}) => {
  const validDataObjects: DataObject[] = [];
  const errorObjects: any = [];

  filteredDataObjects.forEach((obj: DataObject) => {
    const nameValue = obj.title?.trim();
    let coordinates = obj.coordinates;
    const townValue = obj.town?.trim();

    if (coordinates) {
      coordinates = Array.isArray(coordinates)
        ? coordinates.map(Number)
        : [Number(coordinates)];
    }

    if (
      (nameValue === undefined || nameValue === "") &&
      (coordinates === undefined || !isValidCoordinates(coordinates))
    ) {
      errorObjects.push({
        ...obj,
        error: "Title and Location are required",
      });
    } else if (nameValue === undefined || nameValue === "") {
      errorObjects.push({
        ...obj,
        error: "Title is required",
      });
    } else if (coordinates === undefined || !isValidCoordinates(coordinates)) {
      if (townValue === undefined || townValue === "") {
        errorObjects.push({
          ...obj,
          error: "Town or coordinates are required",
        });
      } else {
        validDataObjects.push({
          ...obj,
          coordinates,
        });
      }
    } else {
      validDataObjects.push({ ...obj, coordinates });
    }
  });
  return { validData: validDataObjects, errors: errorObjects };
};

export const getCoordinates = (locationName: any) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationName }, (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        resolve([lat(), lng()]);
      } else {
        reject(`Error fetching coordinates for ${locationName}: ${status}`);
      }
    });
  });
};

export const boundToMapWithPolygon = (polygonCoords: any, map: any) => {
  const bounds = new google.maps.LatLngBounds();
  if (polygonCoords?.length) {
    polygonCoords.forEach((coord: any) => {
      bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
    });
    map.fitBounds(bounds);
  } else {
    new google.maps.LatLng(-25.1198163, 135.9791755);
    map.setZoom(5);
  }
};

export const getPolygonWithMarkers = (points: any) => {
  points.sort((a: any, b: any) => a.lng - b.lng || a.lat - b.lat);

  function cross(o: any, a: any, b: any) {
    return (
      (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng)
    );
  }

  const lower = [];
  for (const point of points) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0
    ) {
      upper.pop();
    }
    upper.push(points[i]);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
};

export const getMarkersImagesBasedOnOrganizationType = (markersData: any) => {
  let organizationTypes: any = markersData?.map((item: any) => {
    return item.organisation_type;
  });
  const uniqueOrganizationTypes = organizationTypes?.filter(
    (value: any, index: any, self: any) => {
      return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        self.indexOf(value) === index
      );
    }
  );

  const OrganizationMarkersImages: Record<string, string> =
    uniqueOrganizationTypes
      ?.filter((type: any) => type !== "")
      .reduce((acc: any, type: any, index: any) => {
        acc[type] = markersImages[index];
        return acc;
      }, {} as Record<string, string>);

  return OrganizationMarkersImages;
};

export const getLocationAddress = ({
  latitude,
  longitude,
  setMarkerData,
  setPlaceDetails,
  markerData,
}: any) => {
  const geocoder = new google.maps.Geocoder();
  const latlng = { lat: latitude, lng: longitude };
  geocoder.geocode({ location: latlng }, (results: any, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        let postalAddress = "";
        let postcode = "";
        let streetAddress = "";
        let town = "";
        const locationName = results[0].formatted_address;
        const addressComponents = results[0].address_components;
        addressComponents.forEach((component: any) => {
          const types = component.types;
          if (types.includes("street_number") || types.includes("route")) {
            streetAddress += (streetAddress ? " " : "") + component.long_name;
          } else if (types.includes("locality")) {
            town = component.long_name;
          } else if (types.includes("postal_code")) {
            postcode = component.long_name;
          }
        });
        postalAddress = [streetAddress, town, postcode]
          .filter(Boolean)
          .join(", ");
        setMarkerData({
          ...markerData,
          postal_address: postalAddress
            ? postalAddress
            : markerData?.postal_address,
          postcode: postcode ? postcode : markerData?.postcode,
          street_address: streetAddress
            ? streetAddress
            : markerData?.street_address,
          town: town ? town : markerData?.town,
        });
        setPlaceDetails({
          postal_address: postalAddress,
          postcode: postcode,
          street_address: streetAddress,
          town: town,
          full_address: locationName,
          coordinates: [latitude, longitude],
        });
      } else {
        console.error("No results found");
      }
    } else {
      console.error("Geocoder failed due to: " + status);
    }
  });
};

const getStaticMap = async (updatedCoords: any, coords: any) => {
  let body = {
    coordinates: [...coords, coords[0]],
    markers: updatedCoords.slice(0, 50),
  };
  try {
    const response = await getStaticMapAPI(body);
    if (response?.status == 200 || response?.status == 201) {
      return response?.data;
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateMapWithCordinatesHelper = async ({
  deleteall,
  allMarkers,
  mapDetails,
  id,
}: any) => {
  let updatedCoords = allMarkers?.map((item: any) => item?.coordinates);
  let newCoords = updatedCoords.map((item: any) => {
    return {
      lat: item[0],
      lng: item[1],
    };
  });
  let coords = getPolygonWithMarkers(newCoords);

  let mapImage;
  if (!deleteall) {
    mapImage = await getStaticMap(updatedCoords, coords);
  }

  let body = {
    title: mapDetails?.title ? mapDetails?.title : "",
    description: mapDetails?.description ? mapDetails?.description : "",
    status: mapDetails?.status,
    geo_type: "polygon",
    geo_coordinates: mapDetails?.geo_coordinates,
    geo_zoom: 14,
    image: mapImage ? mapImage : "",
  };
  try {
    const response = await updateMapWithCordinatesAPI(body, id);
  } catch (err) {
    console.error(err);
  }
};

const capitalize = (text: any) => {
  const spacedText = text.replace(/(\D)(\d)/g, "$1 $2");
  return spacedText
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};
