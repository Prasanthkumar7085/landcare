import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import { Button, Tooltip } from "@mui/material";
import GoogleMapReact from "google-map-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddMapDrawer from "./AddMapDrawer";
import AddPolygonDialog from "./AddPolygonDialog";
import { MapTypeOptions } from "./CustomControls/MapTypeOptions";
import { addCustomControl } from "./CustomControls/NavigationOnMaps";
import styles from "./google-map.module.css";
import GoogleMapComponent from "@/components/Core/GoogleMap";
import { SearchAutoComplete } from "./CustomControls/SearchAutoComplete";

const AddPolygon = () => {
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);
  const drawingManagerRef = React.useRef(null);
  const dispatch = useDispatch();
  const polygonCoords = useSelector((state: any) => state.maps.polygonCoords);
  const [addPolygonOpen, setAddPolygonOpen] = useState<boolean>(false);

  const [mapType, setMapType] = useState("hybrid");
  const [renderField, setRenderField] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [searchedPlaces, setSearchedPlaces] = useState<any>([]);
  const [drawingOpen, setDrawingOpen] = useState<boolean>(false);
  const [polygon, setPolygon] = useState<any>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState<any>();

  const createInfoWindow = (map: any) => {
    const infoWindow = new (window as any).google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;
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

  const handleApiLoaded = (map: any, maps: any) => {
    setMap(map);
    setGoogleMaps(maps);
    mapRef.current = map;
    addCustomControl({ map, maps, mapRef, infoWindowRef });
    MapTypeOptions(map, maps, setMapType);
    SearchAutoComplete({
      placesService,
      maps,
      map,
      mapRef,
    });

    const drawingManager = new maps.drawing.DrawingManager({
      drawingControl: polygonCoords?.length === 0 ? true : false,
      drawingControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT,
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
        const lastCoord = paths[paths.length - 1]; // Accessing the last point of the polygon

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
                // Accessing latitude and longitude from lastCoord object
                const latitude = lastCoord.lat(); // Get the latitude
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
    // Create a new polygon
    const newPolygon = new maps.Polygon({
      paths: polygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: true, // Set the polygon as editable
      draggable: true,
      map: map, // Assuming 'map' is your Google Map instance
    });

    maps.event.addListener(newPolygon, "mouseup", () => {
      const updatedCoords = newPolygon
        .getPath()
        .getArray()
        .map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));
      // Calculate and log the initial area of the polygon

      dispatch(storeEditPolygonCoords(updatedCoords));
    });

    newPolygon.setMap(map);
    setPolygon(newPolygon);

    google.maps.event.addListener(
      drawingManager,
      "drawingmode_changed",
      function () {
        // Check the current drawing mode
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

  //clear all points when the polygon is draw
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
        drawingControl: true, // show drawing options
      });
    }
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      setAddPolygonOpen(false);
    }
  };

  useEffect(() => {
    dispatch(storeEditPolygonCoords([]));
  }, []);
  return (
    <div className={styles.markersPageWeb}>
      {renderField == false ? (
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapComponent
            mapType={mapType}
            handleApiLoaded={handleApiLoaded}
          />

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
                  {/* {editFarmDetails?._id ? "Update" : "Save"} */}
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

      <div></div>
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
