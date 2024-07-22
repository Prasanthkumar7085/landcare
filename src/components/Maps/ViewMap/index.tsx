import GoogleMapComponent from "@/components/Core/GoogleMap";
import { useEffect, useRef, useState } from "react";
import styles from "./view-map.module.css";
import { addCustomControl } from "../AddMap/CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "../AddMap/CustomControls/MapTypeOptions";
import { SearchAutoComplete } from "../AddMap/CustomControls/SearchAutoComplete";
import ViewMapDetailsDrawer from "./ViewMapDetailsBlock";
import { getSingleMapDetailsAPI } from "@/services/maps";
import { useParams } from "next/navigation";

const ViewGoogleMap = () => {
  const { id } = useParams();
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);

  const [renderField, setRenderField] = useState(false);
  const [mapType, setMapType] = useState("hybrid");
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [viewMapDrawerOpen, setViewMapDrawerOpen] = useState<any>(true);
  const [mapDetails, setMapDetails] = useState<any>();
  const [polygonCoords, setPolygonCoords] = useState<any>([]);

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

    maps.event.addListener(newPolygon, "mouseup", () => {
      const updatedCoords = newPolygon
        .getPath()
        .getArray()
        .map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));
      setPolygonCoords(updatedCoords);
    });

    // Set the polygon on the map
    setRenderField(true);
    setTimeout(() => {
      setRenderField(false);
    }, 0.1);
    newPolygon.setMap(map);
  };

  const getSingleMapDetails = async () => {
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
        setRenderField(true);
        setTimeout(() => {
          setRenderField(false);
        }, 0.1);
        console.log(updatedArray, "Fwdii399392");
        setPolygonCoords(updatedArray);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSingleMapDetails();
  }, []);

  return (
    <div className={styles.markersPageWeb}>
      {renderField == false ? (
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapComponent
            mapType={mapType}
            handleApiLoaded={handleApiLoaded}
          />
        </div>
      ) : (
        ""
      )}
      <ViewMapDetailsDrawer mapDetails={mapDetails} />
    </div>
  );
};
export default ViewGoogleMap;
