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

  if (isEmpty) {
    return false;
  }

  if (parsedData[0][0] === "title" && parsedData[0][11] === "coordinates") {
    const updatedPlanData = parsedData.slice(1, 12).map((row: any) => ({
      title: row[0],
      description: row[1],
      status: row[2],
      type: row[3],
      full_address: row[4],
      state: row[5],
      city: row[6],
      zipcode: row[7],
      tags: row[8],
      social_links: row[9],
      added_by: row[10],
      coordinates: row[11],
    }));
    return updatedPlanData;
  } else {
    // toast.error("File does not match the required format");
    return false;
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

  const dataObjects = await Promise.allSettled(
    rows.map(async (row: any) => {
      let obj: any = {};
      headers.forEach((headerName: any, i: any) => {
        const mappedItem = subHeadersMapping[headerName];
        obj[mappedItem] = row[i];
      });
      if (obj["location"]) {
        const coords = await getCoordinates(obj["location"]);
        obj["coordinates"] = coords;
      }
      return obj;
    })
  );
  const filteredDataObjects = dataObjects.filter((obj: any) => {
    const values = Object.values(obj.value);
    return !values.every(
      (value) => value === undefined || value === "" || value === null
    );
  });
  let data = filteredDataObjects.map((item: any) => item.value);
  return data;
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
