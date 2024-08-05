import GoogleMapComponent from "@/components/Core/GoogleMap";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import { getSingleMapDetailsAPI } from "@/services/maps";
import { Button, Tooltip } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddMapDrawer from "./AddMapDrawer";
import AddPolygonDialog from "./AddPolygonDialog";
import styles from "./google-map.module.css";
import Image from "next/image";
import LoadingComponent from "@/components/Core/LoadingComponent";

const AddPolygon = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const drawingManagerRef = React.useRef(null);
  const mapRef: any = useRef(null);
  const router = useRouter();
  const polygonCoords = useSelector((state: any) => state.maps.polygonCoords);
  const [addPolygonOpen, setAddPolygonOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [renderField, setRenderField] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [drawingOpen, setDrawingOpen] = useState<boolean>(false);
  const [polygon, setPolygon] = useState<any>(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState<any>();
  const [mapDetails, setMapDetails] = useState<any>({});

  const setPolygonDrawingMode = () => {
    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
    setDrawingOpen(true);
  };

  const handleAddPolygonButtonClick = () => {
    setPolygonDrawingMode();
    setAddPolygonOpen(false);
  };

  const addPolygonEvent = (event: any, map: any, maps: any) => {
    if (event.type === "polygon") {
      const paths = event.overlay.getPath().getArray();
      let updatedCoords = paths.map((coord: any) => ({
        lat: coord.lat(),
        lng: coord.lng(),
      }));
      setPolygon(event.overlay);
      dispatch(storeEditPolygonCoords(updatedCoords));
      stopDrawingMode();
    }
  };

  const updatePolygonEvent = (newPolygon: any, map: any, maps: any) => {
    const paths = newPolygon.getPath().getArray();
    let updatedCoords = paths.map((coord: any) => ({
      lat: coord.lat(),
      lng: coord.lng(),
    }));
    dispatch(storeEditPolygonCoords(updatedCoords));
    stopDrawingMode();
  };

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
      addPolygonEvent(event, map, maps);
      maps.event.addListener(event.overlay, "mouseup", addPolygonEvent);
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
    maps.event.addListener(newPolygon, "mouseup", (event: any) => {
      updatePolygonEvent(newPolygon, map, maps);
    });

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
            drawingControl: true,
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

  const getSingleMapDetails = async () => {
    setLoading(true);
    try {
      const response = await getSingleMapDetailsAPI(id);
      if (response?.status == 200 || response?.status == 201) {
        setMapDetails(response?.data);
        let updatedArray = response?.data?.geo_coordinates.map((item: any) => {
          return {
            lat: item[0],
            lng: item[1],
          };
        });

        dispatch(storeEditPolygonCoords(updatedArray));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getSingleMapDetails();
    } else {
      dispatch(storeEditPolygonCoords([]));
    }
  }, []);

  useEffect(() => {
    if (map && googleMaps && polygonCoords?.length) {
      if (id) {
        const bounds = new google.maps.LatLngBounds();
        polygonCoords.forEach((coord: any) => {
          bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
        });

        map.fitBounds(bounds);
      }
    }
  }, [map, googleMaps, polygonCoords, id]);

  return (
    <div className={styles.markersPageWeb}>
      {renderField == false && loading == false ? (
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapComponent OtherMapOptions={OtherMapOptions} />
          <div
            className={styles.updateFarmButtonGrp}
            style={{
              position: "absolute",
              top: "0",
              right: "2%",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#75a237 !important",
                color: "black",
                marginTop: "2rem",
              }}
              startIcon={
                <Image
                  src="/map/map-backBtn.svg"
                  alt=""
                  height={15}
                  width={15}
                />
              }
              onClick={() => {
                router.back();
                dispatch(storeEditPolygonCoords([]));
              }}
            >
              Back
            </Button>
          </div>
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
        mapDetails={mapDetails}
        setMapDetails={setMapDetails}
        addDrawerOpen={addDrawerOpen}
        setAddDrawerOpen={setAddDrawerOpen}
        clearAllPoints={clearAllPoints}
        closeDrawing={closeDrawing}
        map={map}
        mapRef={mapRef}
        getSingleMapDetails={getSingleMapDetails}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default AddPolygon;
