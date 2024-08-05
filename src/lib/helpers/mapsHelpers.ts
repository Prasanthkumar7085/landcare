import { toast } from "sonner";

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
  let headers = [
    "Name",
    "Position",
    "Host Organisation",
    "LLS Region",
    "Phone",
    "Email",
    "Location",
    "Postcode",
  ];
  const arraysEqual = (a: any, b: any) =>
    a.length === b.length &&
    a
      .slice()
      .sort()
      .every((item: any, index: number) => item === b.slice().sort()[index]);

  if (isEmpty) {
    toast.warning("File is empty!");
    return false;
  } else if (arraysEqual(headers, parsedData[0]) == false) {
    toast.warning("File is not in the correct format!");
    return false;
  } else if (parsedData?.length == 1) {
    toast.warning("File contains empty data!");
    return false;
  } else {
    return true;
  }
};

export const getImportedFilteredData = async ({ jsonData }: any) => {
  const headers: any =
    jsonData[0]?.length > 8 ? jsonData[0].slice(0, 8) : jsonData[0];
  const subHeadersMapping: any = {
    Name: "name",
    Phone: "phone",
    Position: "position",
    Location: "location",
    Postcode: "post_code",
    "Host Organisation": "host_organization",
    "LLS Region": "lls_region",
    Email: "email",
  };
  const rows: any = jsonData.slice(1);

  const dataObjects = rows.map((row: any) => {
    let obj: any = {};
    headers.forEach((headerName: any, i: any) => {
      const mappedItem = subHeadersMapping[headerName];
      obj[mappedItem] = row[i];
    });
    return obj;
  });

  const filteredDataObjects = dataObjects.filter((obj: any) => {
    const values = Object.values(obj);
    return !values.every(
      (value) => value === undefined || value === "" || value === null
    );
  });

  let errorsData = validationsForImportedData({ filteredDataObjects });
  let data = [...errorsData.validData];

  const locationToCoordinatesMap: any = {};
  const locationsToFetch: string[] = [];
  data.forEach((obj: any) => {
    if (obj.location && !locationToCoordinatesMap[obj.location] && obj.name) {
      locationsToFetch.push(obj.location);
    }
  });

  const coordinatesPromises = locationsToFetch.map(async (location: string) => {
    try {
      const coords = await getCoordinates(location);
      return { location, coords, error: null };
    } catch (error) {
      return { location, coords: null, error };
    }
  });

  const coordinatesResults = await Promise.allSettled(coordinatesPromises);

  const locationErrorsMap: { [key: string]: string } = {};

  coordinatesResults.forEach((result: any) => {
    if (result.status === "fulfilled") {
      const { location, coords, error } = result.value;
      if (!error) {
        locationToCoordinatesMap[location] = coords;
      } else {
        console.error(
          `Failed to fetch coordinates for location: ${location}`,
          error
        );
        locationErrorsMap[location] = "Failed to fetch coordinates";
      }
    } else {
      console.error("Promise rejected:", result.reason);
    }
  });

  const updatedData: any = [];
  const coordinatesErrors: any = [];

  filteredDataObjects.forEach((obj: any) => {
    if (obj.location) {
      const coords = locationToCoordinatesMap[obj.location] || null;
      if (coords && obj?.name) {
        updatedData.push({
          ...obj,
          coordinates: coords,
        });
      } else if (locationErrorsMap[obj.location]) {
        coordinatesErrors.push({
          ...obj,
          error: locationErrorsMap[obj.location],
        });
      }
    }
  });

  return [updatedData, [...errorsData.errors, ...coordinatesErrors]];
};

const validationsForImportedData = ({ filteredDataObjects }: any) => {
  const validDataObjects: any[] = [];
  const errorObjects: any[] = [];
  filteredDataObjects.forEach((result: any) => {
    const obj = { ...result };
    const nameValue = obj.name;
    const locationValue = obj.location;

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
  polygonCoords.forEach((coord: any) => {
    bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
  });

  map.fitBounds(bounds);
};
