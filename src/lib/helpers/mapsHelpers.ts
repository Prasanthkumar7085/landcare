export const calculatePolygonCentroid = (coordinates: any) => {
  let x = 0,
    y = 0;
  for (let i = 0; i < coordinates?.length; i++) {
    x += coordinates[i][0];
    y += coordinates[i][1];
  }
  return { lat: x / coordinates?.length, lng: y / coordinates?.length };
};

export const handleGeneratePolygonBase64 = (
  map: any,
  mapRef: any,
  polygonCoords: any
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const expansionFactor = 0.9;
    const canvasWidth = 600;
    const canvasHeight = 400;
    mapRef.current = map;

    const latitudes = polygonCoords.map((coord: any) => coord.lat);
    const longitudes = polygonCoords.map((coord: any) => coord.lng);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const polygonWidth = maxLng - minLng;
    const polygonHeight = maxLat - minLat;

    const centerLng = (maxLng + minLng) / 2;
    const centerLat = (maxLat + minLat) / 2;

    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const mapImage = mapRef.current.getDiv().querySelector("img");
    const zoomLevel = map.getZoom();

    if (mapImage) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = mapImage.src;
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

          ctx.translate(canvasWidth / 2, canvasHeight / 2);
          const zoomFactor = 0.5;

          ctx.beginPath();
          polygonCoords.forEach((coord: any, index: number) => {
            const x =
              ((coord.lng - centerLng) / polygonWidth) *
              canvasWidth *
              zoomFactor;
            const y =
              ((centerLat - coord.lat) / polygonHeight) *
              canvasHeight *
              zoomFactor;

            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          ctx.fill();
          ctx.strokeStyle = "red";
          ctx.stroke();

          ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

          const dataUrl = canvas.toDataURL();
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = (error) => reject(error);
    } else {
      reject(new Error("Map image not found"));
    }
  });
};
