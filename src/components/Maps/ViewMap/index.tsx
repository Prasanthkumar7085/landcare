import GoogleMapComponent from "@/components/Core/GoogleMap";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { calculatePolygonCentroid } from "@/lib/helpers/mapsHelpers";
import {
  getAllMapMarkersAPI,
  getSingleMapDetailsAPI,
  getSingleMapMarkersAPI,
} from "@/services/maps";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MarkerPopup from "./AddMarker/AddMarkerFrom";
import styles from "./view-map.module.css";
import ViewMapDetailsDrawer from "./ViewMapDetailsBlock";
import { Button } from "@mui/material";

const ViewGoogleMap = () => {
  const { id } = useParams();

  const drawingManagerRef = useRef(null);
  const pathName = usePathname();

  const [loading, setLoading] = useState(true);
  const [renderField, setRenderField] = useState(false);
  const [map, setMaps] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [mapDetails, setMapDetails] = useState<any>({});
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapRef, setMapRef] = useState<any>(null);
  const [singleMarkers, setSingleMarkers] = useState<any[]>([]);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [search, setSearch] = useState("");
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [localMarkers, setLocalMarkers] = useState<any>([]);
  const [overlays, setOverlays] = useState<any[]>([]);

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

  const removalMarker = (markerIndex: number) => {
    const marker = localMarkers[markerIndex];
    if (marker) {
      marker.setMap(null);
      setLocalMarkers((prevMarkers: any) =>
        prevMarkers.filter((_: any, i: any) => i !== markerIndex)
      );
    }
    const overlay = overlays[markerIndex];
    if (overlay) {
      overlay.setMap(null);
      setOverlays((prevOverlays: any) =>
        prevOverlays.filter((_: any, i: any) => i !== markerIndex)
      );
    }
  };

  const addMarkerEVent = (event: any, map: any, maps: any) => {
    const marker = new google.maps.Marker({
      position: event.overlay.getPosition(),
      map: map,
      draggable: true,
    });
    setShowMarkerPopup(true);
    setSelectedMarker(marker);
    setLocalMarkers((prev: any) => [...prev, marker]);
    const newOverlay = event.overlay;
    setOverlays((prevOverlays) => [...prevOverlays, newOverlay]);

    marker.setMap(map);

    const markerPosition: any = marker.getPosition();
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
    setMaps(map);
    setGoogleMaps(maps);
    const drawingManager = new maps.drawing.DrawingManager({
      drawingControl: pathName?.includes("/view-map") ? false : true,
      drawingControlOptions: {
        position: maps.ControlPosition.LEFT_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.MARKER],
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

    maps.event.addListener(drawingManager, "overlaycomplete", (event: any) => {
      addMarkerEVent(event, map, maps);
    });

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
    if (map && googleMaps) {
      let centroid = calculatePolygonCentroid(mapDetails?.geo_coordinates);
      const indiaCenter = { lat: centroid.lat, lng: centroid.lng };
      map.setCenter(indiaCenter);
      map.setZoom(17);
    }
  }, [map, googleMaps]);

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
        placeDetails={placeDetails}
        getAllMapMarkers={getAllMapMarkers}
        removalMarker={removalMarker}
      />

      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ViewGoogleMap;
