import GoogleMapReact from "google-map-react";
import styles from "./google-map.module.css";
import React, { useEffect, useRef, useState } from "react";
import { addCustomControl } from "./CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "./CustomControls/MapTypeOptions";
import { useDispatch, useSelector } from "react-redux";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import AddPolygonDialog from "./AddPolygonDialog";
import AddMapDrawer from "./AddMapDrawer";
import { Button, Tooltip } from "@mui/material";
import Image from "next/image";

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

  const centerMapToPlace = (place: any) => {
    if (mapRef.current && place?.geometry && place.geometry.location) {
      const location = place.geometry.location;
      if (
        location &&
        typeof location.lat === "function" &&
        typeof location.lng === "function"
      ) {
        const latLng = new google.maps.LatLng(location.lat(), location.lng());
        mapRef.current.panTo(latLng);
        mapRef.current.setZoom(15);
      } else {
        console.error("Invalid location object");
      }
    }
  };

  const handleApiLoaded = (map: any, maps: any) => {
    setMap(map);
    setGoogleMaps(maps);
    mapRef.current = map;
    addCustomControl({ map, maps, mapRef, infoWindowRef });
    MapTypeOptions(map, maps, setMapType);

    placesService.current = new maps.places.PlacesService(map);

    const customAutocompleteDiv = document.createElement("div");
    customAutocompleteDiv.style.position = "relative";
    customAutocompleteDiv.style.width = "30%";
    const searchInput = document.createElement("input");
    searchInput.setAttribute("id", "searchInput");
    searchInput.setAttribute("placeholder", "Search for a place...");
    searchInput.setAttribute("value", "");
    searchInput.style.marginTop = "10px";
    searchInput.style.marginLeft = "2.5px";
    searchInput.style.padding = "13px";
    searchInput.style.width = "calc(100% - 32px)";

    searchInput.style.borderRadius = "10px";
    searchInput.style.overflow = "hidden";
    searchInput.style.textOverflow = "ellipsis";

    // Create a custom icon
    const icon = document.createElement("div");
    icon.innerHTML = "&#10060;";
    icon.style.position = "absolute";
    icon.style.top = "61%";
    icon.style.left = "87%";
    icon.style.transform = "translateY(-50%)";
    icon.style.padding = "10px";
    icon.style.cursor = "pointer";
    icon.style.display = searchInput.value ? "block" : "none";

    // Attach click event to the icon
    icon.addEventListener("click", () => {
      searchInput.value = "";
      icon.style.display = "none";
    });

    searchInput.addEventListener("input", () => {
      icon.style.display = searchInput.value ? "block" : "none";
    });

    customAutocompleteDiv.appendChild(searchInput);
    customAutocompleteDiv.appendChild(icon);

    map.controls[maps.ControlPosition.TOP_LEFT].push(customAutocompleteDiv);
    const autocomplete = new maps.places.Autocomplete(searchInput, {
      placeAutocompleteOptions: { strictBounds: false },
    });

    const onPlaceChanged = () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.error("No place data available");
        return;
      }

      let location = place.formatted_address.split(",");
      setSearchedPlaces([place]);
      centerMapToPlace([place]);
    };

    autocomplete.addListener("place_changed", onPlaceChanged);

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

    // Set the polygon on the map

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
      updatedCoords.pop(); // Remove the last point from the copied coordinates
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

  return (
    <div className={styles.markersPageWeb}>
      {renderField == false ? (
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
              libraries: ["drawing", "places"],
            }}
            defaultCenter={{
              lat: 20.5937,
              lng: 78.9629,
            }}
            options={{
              mapTypeId: mapType,
              fullscreenControl: false,
              rotateControl: true,
              streetViewControl: true,
            }}
            defaultZoom={6}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          ></GoogleMapReact>

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
      />
    </div>
  );
};
export default AddPolygon;
