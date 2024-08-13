import { toast } from "sonner";
import {
  SheetHeaders,
  subHeadersMappingConstants,
} from "../constants/mapConstants";

export const calculatePolygonCentroid = (coordinates: any) => {
  let x = 0,
    y = 0;
  for (let i = 0; i < coordinates?.length; i++) {
    x += coordinates[i][0];
    y += coordinates[i][1];
  }
  return { lat: x / coordinates?.length, lng: y / coordinates?.length };
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
  } else if (arraysEqual(SheetHeaders, parsedData[0]) == false) {
    toast.warning("File is not in the correct format!");
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
      return value.split(",").map((coord: string) => parseFloat(coord.trim()));
    case "postcode":
      return value.toString();
    case "tags":
    case "images":
      return value.split(",").map((item: string) => item.trim());
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
      obj[mappedItem] = parseField(value, mappedItem);
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
  console.log(updatedData, "fdasiiwqe");
  filteredDataObjects.forEach((obj: any) => {
    if (obj.coordinates.length) {
      const coords = obj.coordinates;
      if (coords && obj?.title) {
        updatedData.push({
          ...obj,
          coordinates: coords,
        });
      }
    } else if (obj.town) {
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
  console.log([updatedData, coordinatesErrors], "okkkk");
  return [updatedData, coordinatesErrors];
};

export const getImportedFilteredData = async ({ jsonData }: any) => {
  const headers: any =
    jsonData[0]?.length > 15 ? jsonData[0].slice(0, 15) : jsonData[0];
  const rows: any = jsonData.slice(1);

  const dataObjects = parseRows(rows, headers);
  const filteredDataObjects = dataObjects.filter((obj: any) => {
    const values = Object.values(obj);
    return !values.every(
      (value) => value === undefined || value === "" || value === null
    );
  });

  let errorsData = validationsForImportedData({ filteredDataObjects });
  let data = [...errorsData.validData];
  const locationToCoordinatesMap: any = {};
  const townsToFetch: string[] = [];
  console.log(townsToFetch, "032oo32o32");
  console.log(locationToCoordinatesMap, "dsjajdasjasj");
  data.forEach((obj: any) => {
    if (
      !obj.coordinates.length &&
      obj.town &&
      !townsToFetch.includes(obj.town)
    ) {
      console.log(obj, "oowoowqoqwoq owq");
      townsToFetch.push(obj.town);
    }
  });

  const townCoordinatesResults = await fetchTownCoordinates(townsToFetch);

  const locationErrorsMap: { [key: string]: string } = {};
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
    filteredDataObjects,
    locationToCoordinatesMap,
    locationErrorsMap
  );
  return [updatedData, [...errorsData.errors, ...coordinatesErrors]];
};

const validationsForImportedData = ({ filteredDataObjects }: any) => {
  const validDataObjects: any[] = [];
  const errorObjects: any[] = [];
  filteredDataObjects.forEach((result: any) => {
    const obj = { ...result };
    const nameValue = obj.title;
    const locationValue = obj.coordinates;

    if (
      (nameValue === undefined || nameValue === "" || nameValue === null) &&
      (locationValue === undefined ||
        locationValue === "" ||
        locationValue === null)
    ) {
      errorObjects.push({
        ...obj,
        error: "Name and Location are required",
      });
    } else if (
      nameValue === undefined ||
      nameValue === "" ||
      nameValue === null
    ) {
      errorObjects.push({
        ...obj,
        error: "Name is required",
      });
    } else if (
      locationValue === undefined ||
      locationValue === "" ||
      locationValue === null
    ) {
      errorObjects.push({
        ...obj,
        error: "Location is required",
      });
    } else {
      validDataObjects.push(obj);
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
