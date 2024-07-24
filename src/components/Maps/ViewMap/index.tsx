import GoogleMapComponent from "@/components/Core/GoogleMap";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { calculatePolygonCentroid } from "@/lib/helpers/mapsHelpers";
import {
  getAllMapMarkersAPI,
  getSingleMapDetailsAPI,
  getSingleMapMarkersAPI,
} from "@/services/maps";
import styles from "./view-map.module.css";
import { addCustomControl } from "../AddMap/CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "../AddMap/CustomControls/MapTypeOptions";
import { SearchAutoComplete } from "../AddMap/CustomControls/SearchAutoComplete";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MarkerPopup from "./AddMarker/AddMarkerFrom";
import ViewMapDetailsDrawer from "./ViewMapDetailsBlock";

const ViewGoogleMap = () => {
  const { id } = useParams();

  const drawingManagerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [renderField, setRenderField] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [viewMapDrawerOpen, setViewMapDrawerOpen] = useState<any>(true);
  const [mapDetails, setMapDetails] = useState<any>({});
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  console.log(polygonCoords, "r4pp43p4p3p43");
  console.log(markers, "34343443");
  const [singleMarkers, setSingleMarkers] = useState<any[]>([]);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [search, setSearch] = useState("");

  console.log(markers, "Fdsdododoods");
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [popupMarker, setPopupMarker] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
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

  function setMarkerDrawingMode() {
    const drawingManager: any = drawingManagerRef.current;

    if (drawingManager) {
      drawingManager.setOptions({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
      });
    }
  }

  const closeDrawing = () => {
    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
    }
  };

  const removalMarker = () => {
    if (selectedMarker) {
      selectedMarker.setMap(null);
      setSelectedMarker(null);
    }
  };

  const addMarkerEVent = (event: any) => {
    const marker = new googleMaps.Marker({
      position: event.overlay.getPosition(),
      map: map,
      draggable: true,
    });
    setShowMarkerPopup(true);
    setSelectedMarker(marker);
    const markerPosition = marker.getPosition();
    const latitude = markerPosition.lat();
    const longitude = markerPosition.lng();

    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };
    geocoder.geocode({ location: latlng }, (results: any, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const locationName = results[0].formatted_address;
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
  };

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
    const newPolygon = new maps.Polygon({
      paths: polygonCoords,
      strokeColor: "#282628",
      strokeOpacity: 0.8,
      strokeWeight: 4,
      fillOpacity: 0,
      editable: false,
      draggable: false,
      map: map,
    });
    newPolygon.setMap(map);

    maps.event.addListener(drawingManager, "overlaycomplete", addMarkerEVent);

    for (let i = 0; i < markers.length; i++) {
      const markerData = markers[i];
      const latLng = new google.maps.LatLng(
        markerData.coordinates[0],
        markerData.coordinates[1]
      );

      const markere = new google.maps.Marker({
        position: latLng,
        map: map,
        title: markerData.title,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
        animation: google.maps.Animation.DROP,
      });
      markere.setMap(map);
    }
    let centroid = calculatePolygonCentroid(mapDetails?.geo_coordinates);
    centerToPolygon(centroid);
  };

  const centerToPolygon = (value: any) => {
    map.setCenter(value);
    map.setZoom(17);
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
        await getSingleMapMarkers({
          page: 1,
          limit: 5,
        });
        setPolygonCoords(updatedArray);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllMapMarkers = async ({
    page = 1,
    limit = 8,
    search_string = search,
  }) => {
    try {
      let queryParams: any = {
        search_string: search_string ? search_string : "",
        page: page,
        limit: limit,
      };
      const response = await getAllMapMarkersAPI(id, queryParams);
      const { data, ...rest } = response;
      setMarkers(data);
      setPaginationDetails(rest);
    } catch (err) {
      console.error(err);
    }
  };

  const getSingleMapMarkers = async ({ page = 1, limit = 5 }) => {
    setLoading(true);
    try {
      let queryParams: any = {
        page: page,
        limit: limit,
      };
      const response = await getSingleMapMarkersAPI(id, queryParams);
      const { data, ...rest } = response;
      setSingleMarkers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSingleMapDetails();
  }, []);

  useEffect(() => {
    getAllMapMarkers({
      page: 1,
      limit: 8,
      search_string: search,
    });
  }, [search]);

  return (
    <div
      className={styles.markersPageWeb}
      style={{ display: id && loading == false ? "" : "none" }}
    >
      <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
        <GoogleMapComponent OtherMapOptions={OtherMapOptions} />
      </div>

      <ViewMapDetailsDrawer
        mapDetails={mapDetails}
        markers={markers}
        paginationDetails={paginationDetails}
        getData={getAllMapMarkers}
        setSearch={setSearch}
        search={search}
        singleMarkers={singleMarkers}
      />
      <MarkerPopup
        setShowMarkerPopup={setShowMarkerPopup}
        showMarkerPopup={showMarkerPopup}
        popupMarker={popupMarker}
        placeDetails={placeDetails}
        getSingleMapMarkers={getSingleMapMarkers}
        removalMarker={removalMarker}
      />

      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ViewGoogleMap;
