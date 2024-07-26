import GoogleMapComponent from "@/components/Core/GoogleMap";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import { Button, Tooltip } from "@mui/material";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddMapDrawer from "./AddMapDrawer";
import AddPolygonDialog from "./AddPolygonDialog";
import styles from "./google-map.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddPolygon = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);
  const drawingManagerRef = React.useRef(null);
  const polygonRef = useRef<any>(null);

  const polygonCoords = useSelector((state: any) => state.maps.polygonCoords);

  const [addPolygonOpen, setAddPolygonOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [renderField, setRenderField] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [drawingOpen, setDrawingOpen] = useState<boolean>(false);
  const [polygon, setPolygon] = useState<any>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState<any>();

  const createInfoWindow = (map: any) => {
    const infoWindow = new (window as any).google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;
  };

  const handleGenerateBase64 = () => {
    mapRef.current = map;
    if (polygonRef.current && mapRef.current) {
      const canvas = document.createElement("canvas");
      const map = mapRef.current;

      const bounds = new window.google.maps.LatLngBounds();
      polygonCoords.forEach((coord: any) =>
        bounds.extend({ lat: coord[0], lng: coord[1] })
      );

      const scale = 2; // adjust as needed for better resolution
      const mapWidth =
        scale * (bounds.getNorthEast().lng() - bounds.getSouthWest().lng());
      const mapHeight =
        scale * (bounds.getNorthEast().lat() - bounds.getSouthWest().lat());

      canvas.width = mapWidth;
      canvas.height = mapHeight;

      const ctx: any = canvas.getContext("2d");
      const projection = map.getProjection();

      ctx.fillStyle = polygonRef.current.getOptions().fillColor; // Access fillColor from polygon options
      ctx.strokeStyle = polygonRef.current.getOptions().strokeColor; // Access strokeColor from polygon options
      ctx.lineWidth = polygonRef.current.getOptions().strokeWeight; // Access strokeWeight from polygon options

      ctx.beginPath();
      polygonCoords.forEach((coord: any) => {
        const pixel = projection.fromLatLngToPoint({
          lat: coord[0],
          lng: coord[1],
        });
        ctx.lineTo(pixel.x * scale, pixel.y * scale);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const dataUrl = canvas.toDataURL();
      console.log(dataUrl, "fdsakdskdskdkks");
    }
  };

  function setPolygonDrawingMode() {
    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
    setDrawingOpen(true);
  }

  function handleAddPolygonButtonClick() {
    setPolygonDrawingMode();
    setAddPolygonOpen(false);
  }

  const OtherMapOptions = (map: any, maps: any) => {
    setMap(map);
    setGoogleMaps(maps);

    const drawingManager = new maps.drawing.DrawingManager({
      drawingControl: polygonCoords?.length === 0 ? true : false,
      drawingControlOptions: {
        position: maps.ControlPosition.LEFT_CENTER,
        drawingModes: [maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        draggable: false,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;
    maps.event.addListener(drawingManager, "overlaycomplete", (event: any) => {
      if (event.type === "polygon") {
        const paths = event.overlay.getPath().getArray();
        let updatedCoords = paths.map((coord: any) => ({
          lat: coord.lat(),
          lng: coord.lng(),
        }));

        const geocoder = new maps.Geocoder();
        const lastCoord = paths[paths.length - 1];

        geocoder.geocode(
          { location: lastCoord },
          (results: any, status: any) => {
            if (status === "OK") {
              if (results[0]) {
                let locationName = results[0].formatted_address;
                locationName = locationName?.split(",")[0];
                let afterRemoveingSpaces = locationName
                  .split(" ")[1]
                  ?.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]/g, "");
                const latitude = lastCoord.lat();
                const longitude = lastCoord.lng();
                const geocoder = new google.maps.Geocoder();
                const latlngs = { lat: latitude, lng: longitude };

                dispatch(storeEditPolygonCoords(updatedCoords));
                stopDrawingMode();
              } else {
                console.log("No results found");
              }
            } else {
              console.log("Geocoder failed due to:", status);
            }
          }
        );
      }
    });
    const newPolygon = new maps.Polygon({
      paths: polygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      map: map,
    });

    maps.event.addListener(newPolygon, "mouseup", () => {
      const updatedCoords = newPolygon
        .getPath()
        .getArray()
        .map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));

      dispatch(storeEditPolygonCoords(updatedCoords));
    });
    polygonRef.current = newPolygon;

    newPolygon.setMap(map);
    setPolygon(newPolygon);

    google.maps.event.addListener(
      drawingManager,
      "drawingmode_changed",
      function () {
        const currentDrawingMode = drawingManager.getDrawingMode();

        if (currentDrawingMode === null) {
          setDrawingOpen(false);
        } else {
          setAddPolygonOpen(true);
        }
      }
    );
    createInfoWindow(map);
  };

  //close drawing
  const closeDrawing = () => {
    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
    }
  };

  //stop the drawing mode
  const stopDrawingMode = () => {
    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
    }
    if (drawingManager) {
      drawingManager.setOptions({
        drawingControl: false,
      });
    }
  };

  const undoLastPoint = () => {
    if (googleMaps && polygon) {
      const updatedCoords = [...polygonCoords];
      updatedCoords.pop();
      dispatch(storeEditPolygonCoords(updatedCoords));

      const path = updatedCoords.map(
        (coord: any) => new (googleMaps as any).LatLng(coord.lat, coord.lng)
      );

      polygon.setPath(path);
      if (updatedCoords?.length == 0) {
        const drawingManager: any = drawingManagerRef.current;
        if (drawingManager) {
          drawingManager.setOptions({
            drawingControl: true, // show drawing options
          });
        }
        if (drawingManager) {
          drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.POLYGON
          );
        }
        setAddPolygonOpen(false);
      }
    }
  };

  const clearAllPoints = () => {
    if (googleMaps && polygon) {
      dispatch(storeEditPolygonCoords([]));
      polygon.setPath([]);
      setRenderField(true);
      setTimeout(() => {
        setRenderField(false);
      }, 100);
    }

    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setOptions({
        drawingControl: true,
      });
    }
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      setAddPolygonOpen(false);
    }
  };

  // Function to generate static map image URL
  const generateStaticMapUrl = () => {
    if (polygonCoords.length === 0) {
      return;
    }

    const center = `${polygonCoords[3].lat},${polygonCoords[3].lng}`;
    const path = polygonCoords
      .map(({ lat, lng }: any) => `${lat},${lng}`)
      .join("|");
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=8&size=600x400&path=color:0x0000ff|weight:5|fillcolor:0xFFFF00|${path}&key=${apiKey}`;

    return mapUrl;
  };

  // Function to fetch and convert image to base64
  const fetchMapImage = async () => {
    const mapUrl = generateStaticMapUrl();
    if (!mapUrl) {
      return;
    }

    try {
      const response: any = await axios.get(mapUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        console.log(base64data, "Fdso993993939");
      };
    } catch (error) {
      console.error("Error fetching map image:", error);
    }
  };

  return (
    <div className={styles.markersPageWeb}>
      {renderField == false ? (
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapComponent OtherMapOptions={OtherMapOptions} />

          {polygonCoords?.length === 0 ? (
            ""
          ) : (
            <div
              className={styles.updateFarmButtonGrp}
              style={{
                position: "absolute",
                top: "22%",
                right: "25%",
              }}
            >
              <button onClick={() => handleGenerateBase64()}>
                Generate Map Image
              </button>
              <Tooltip title="Clear">
                <Button
                  onClick={clearAllPoints}
                  variant="contained"
                  disabled={polygonCoords?.length === 0}
                >
                  <Image
                    src="/markers/clear-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </Button>
              </Tooltip>
              <Tooltip title={"Save"}>
                <Button
                  onClick={() => {
                    setAddDrawerOpen(true);
                  }}
                  variant="contained"
                  disabled={polygonCoords?.length >= 3 ? false : true}
                  sx={{ display: polygonCoords?.length >= 3 ? "" : "none" }}
                >
                  <Image
                    src={"/markers/save-icon.svg"}
                    alt=""
                    width={20}
                    height={20}
                  />
                </Button>
              </Tooltip>
              <Tooltip title="Undo">
                <Button
                  onClick={undoLastPoint}
                  variant="contained"
                  disabled={polygonCoords?.length === 0}
                >
                  <Image
                    src="/markers/undo-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
      <AddPolygonDialog
        addPolygonOpen={addPolygonOpen}
        setAddPolygonOpen={setAddPolygonOpen}
        handleAddPolygonButtonClick={handleAddPolygonButtonClick}
        closeDrawing={closeDrawing}
        setDrawingOpen={setDrawingOpen}
      />
      <AddMapDrawer
        addDrawerOpen={addDrawerOpen}
        setAddDrawerOpen={setAddDrawerOpen}
        clearAllPoints={clearAllPoints}
        closeDrawing={closeDrawing}
      />
    </div>
  );
};
export default AddPolygon;
