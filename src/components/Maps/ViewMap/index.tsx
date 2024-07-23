import GoogleMapComponent from "@/components/Core/GoogleMap";
import { useEffect, useRef, useState } from "react";
import styles from "./view-map.module.css";
import { addCustomControl } from "../AddMap/CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "../AddMap/CustomControls/MapTypeOptions";
import { SearchAutoComplete } from "../AddMap/CustomControls/SearchAutoComplete";
import ViewMapDetailsDrawer from "./ViewMapDetailsBlock";
import { getSingleMapDetailsAPI } from "@/services/maps";
import { useParams } from "next/navigation";
import LoadingComponent from "@/components/Core/LoadingComponent";
import MarkerPopup from "./AddMarker/AddMarkerFrom";

const ViewGoogleMap = () => {
  const { id } = useParams();

  const drawingManagerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [renderField, setRenderField] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [viewMapDrawerOpen, setViewMapDrawerOpen] = useState<any>(true);
  const [mapDetails, setMapDetails] = useState<any>({});
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [popupMarker, setPopupMarker] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null); // State to hold the selected marker
  console.log(selectedMarker, "dsppdsd0d");

  const [placeDetails, setPlaceDetails] = useState<any>({
    full_address: "",
    state: "",
    city: "",
    zipcode: "",
    images: "",
    tags: "",
    social_links: "",
    coordinates: [],
  });

  const OtherMapOptions = (map: any, maps: any) => {
    setMap(map);
    setGoogleMaps(maps);

    const drawingManager = new maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: maps.ControlPosition.LEFT_CENTER,
        drawingModes: ["marker"],
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // Create a click event listener for the map
    maps.event.addListener(map, "click", (event: any) => {
      const marker = new maps.Marker({
        position: event.latLng,
        map: map,
        draggable: true,
      });

      // Add marker click event listener
      maps.event.addListener(marker, "click", () => {
        setSelectedMarker(marker);
        setShowMarkerPopup(true);
        const markerPosition = marker.getPosition();
        const markerInformation = marker.markerInfo;

        const latitude = markerPosition.lat(); // Get the latitude
        const longitude = markerPosition.lng();

        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };

        geocoder.geocode({ location: latlng }, (results: any, status) => {
          console.log(results, "FSDo339932932");
          console.log();
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              console.log(results[0], "locations");
              const locationName = results[0].formatted_address; // Get the formatted address
              setPlaceDetails({
                full_address: locationName,
                coordinates: [latitude, longitude],
              });
            } else {
              console.log("No results found");
            }
          } else {
            console.log("Geocoder failed due to: " + status);
          }
        });
      });
      console.log(marker, "fdasiidsiidi");
      setMarkers((prevMarkers) => [...prevMarkers, marker]);
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;
    const newPolygon = new maps.Polygon({
      paths: polygonCoords,
      strokeColor: "#282628",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#78817e",
      fillOpacity: 0.35,
      editable: false,
      draggable: false,
      map: map,
    });
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

        setPolygonCoords(updatedArray);
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
    }
  }, []);

  return (
    <div
      className={styles.markersPageWeb}
      style={{ display: mapDetails?.id && renderField == false ? "" : "none" }}
    >
      <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
        <GoogleMapComponent OtherMapOptions={OtherMapOptions} />
      </div>

      <ViewMapDetailsDrawer mapDetails={mapDetails} />
      <MarkerPopup
        setShowMarkerPopup={setShowMarkerPopup}
        showMarkerPopup={showMarkerPopup}
        popupMarker={popupMarker}
        placeDetails={placeDetails}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ViewGoogleMap;
