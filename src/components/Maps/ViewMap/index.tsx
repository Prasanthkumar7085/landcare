import GoogleMapComponent from "@/components/Core/GoogleMap";
import { useEffect, useRef, useState } from "react";
import styles from "./view-map.module.css";
import { addCustomControl } from "../AddMap/CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "../AddMap/CustomControls/MapTypeOptions";
import { SearchAutoComplete } from "../AddMap/CustomControls/SearchAutoComplete";
import ViewMapDetailsDrawer from "./ViewMapDetailsBlock";
import { getSingleMapDetailsAPI, getSingleMapMarkersAPI } from "@/services/maps";
import { useParams } from "next/navigation";
import LoadingComponent from "@/components/Core/LoadingComponent";

const ViewGoogleMap = () => {
  const { id } = useParams();
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);
  const drawingManagerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [renderField, setRenderField] = useState(false);
  const [mapType, setMapType] = useState("hybrid");
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [viewMapDrawerOpen, setViewMapDrawerOpen] = useState<any>(true);
  const [mapDetails, setMapDetails] = useState<any>();
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const [markers, setMarkers] = useState<any[]>([]);

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
      drawingControl: false,
      drawingControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT,
        drawingModes: [maps.drawing.OverlayType.POLYGON],
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;
    const newPolygon = new maps.Polygon({
      paths: polygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: false,
      draggable: false,
      map: map,
    });

    // maps.event.addListener(map, "click", (event: any) => {
    //   addMarker(event.latLng);
    // });
    // Set the polygon on the map
    setRenderField(false);
    setTimeout(() => {
      setRenderField(true);
    }, 0.1);
    centerToPolygon(mapDetails?.geo_coordinates);

    newPolygon.setMap(map);
  };

  const centerToPolygon = (value: any) => {
    if (value?.length > 0) {
      const indiaCenter = {
        lat: +value?.[0][0],
        lng: +value?.[0][1],
      };
      map.setCenter(indiaCenter);
      map.setZoom(17);
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
        setRenderField(false);
        setTimeout(() => {
          setRenderField(true);
        }, 0.1);

        setPolygonCoords(updatedArray);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSingleMapMarkers = async () => {
    setLoading(true);
    try {
      const response = await getSingleMapMarkersAPI(id);
      setMarkers(response?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const addMarker = (location: any,) => {
  //   const marker = new googleMaps.Marker({
  //     position: location,
  //     map: mapRef.current,
  //     draggable: true,
  //   });

  //   // Add marker to the markers state array
  //   setMarkers([...markers, marker]);

  //   // Example: Add a click listener to remove the marker
  //   marker.addListener("click", () => {
  //     marker.setMap(null); // Remove marker from map
  //     const updatedMarkers = markers.filter((m) => m !== marker);
  //     setMarkers(updatedMarkers);
  //   });
  // };

  useEffect(() => {
    getSingleMapDetails();
    getSingleMapMarkers();
  }, []);

  return (
    <div className={styles.markersPageWeb}>
      {mapDetails?.id ? (
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapComponent
            mapType={mapType}
            handleApiLoaded={handleApiLoaded}
          />
        </div>
      ) : (
        ""
      )}
      <ViewMapDetailsDrawer mapDetails={mapDetails} markers={markers} />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ViewGoogleMap;
