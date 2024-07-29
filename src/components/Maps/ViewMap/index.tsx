import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GoogleMapComponent from "@/components/Core/GoogleMap";
import LoadingComponent from "@/components/Core/LoadingComponent";
import ViewMarkerDrawer from "@/components/Maps/ViewMap/ViewMarkerDrawer";
import { mapTypeOptions } from "@/lib/constants/mapConstants";
import {
  getSingleMapDetailsAPI,
  getSingleMapMarkersAPI,
} from "@/services/maps";
import MarkerPopup from "./AddMarker/AddMarkerFrom";
import styles from "./view-map.module.css";
import ViewMapDetailsDrawer from "./ViewMapDetailsBlock";

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
  const [searchString, setSearchString] = useState("");
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [localMarkers, setLocalMarkers] = useState<any>([]);
  const [overlays, setOverlays] = useState<any[]>([]);
  const [singleMarkeropen, setSingleMarkerOpen] = useState(false);
  const [markerData, setMarkerData] = useState<any>();
  const [markerOption, setMarkerOption] = useState<any>();
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

  const renderAllMarkers = (markers1: any) => {
    markers1.forEach((markerData: any) => {
      const latLng = new google.maps.LatLng(
        markerData.coordinates[0],
        markerData.coordinates[1]
      );
      const markere = new google.maps.Marker({
        position: latLng,
        map: map,
        title: markerData.title,
        icon: {
          url: mapTypeOptions?.find(
            (item: any) => item?.title == markerData.type
          )?.img as string,
        },
        animation: google.maps.Animation.DROP,
      });
      markere.setMap(map);
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

  const getSingleMapMarkers = async ({
    page = 1,
    limit = 5,
    search_string = searchString,
    sort_by = markerOption?.value,
    sort_type = markerOption?.title
  }) => {
    try {
      let queryParams: any = {
        page: page,
        limit: limit,
        search_string: search_string,
        sort_by: sort_by,
        sort_type: sort_type
      };
      const response = await getSingleMapMarkersAPI(id, queryParams);
      const { data, ...rest } = response;
      setMarkers(data);
      renderAllMarkers(data);
      setSingleMarkers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSingleMapMarkers({
      page: 1,
      limit: 5,
      search_string: searchString,
      sort_by: markerOption?.value,
      sort_type: markerOption?.title
    });
  }, [searchString, markerOption?.value, markerOption?.title]);

  useEffect(() => {
    getSingleMapDetails();
  }, []);

  useEffect(() => {
    if (map && googleMaps) {
      const bounds = new google.maps.LatLngBounds();
      polygonCoords.forEach((coord: any) => {
        bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
      });

      map.fitBounds(bounds);
    }
  }, [map, googleMaps, markers]);

  useEffect(() => {
    if (markers?.length > 0 && map) {
      renderAllMarkers(markers);
    }
  }, [markers, map]);

  return (
    <div
      className={styles.markersPageWeb}
      style={{ display: loading == false ? "" : "none" }}
    >
      <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
        <GoogleMapComponent OtherMapOptions={OtherMapOptions} />
      </div>

      {singleMarkeropen == true ? (
        <ViewMarkerDrawer
          onClose={setSingleMarkerOpen}
          data={markerData}
          setData={setMarkerData}
        />
      ) : (
        <ViewMapDetailsDrawer
          mapDetails={mapDetails}
          singleMarkers={singleMarkers}
          setSearchString={setSearchString}
          searchString={searchString}
          setSingleMarkerOpen={setSingleMarkerOpen}
          singleMarkeropen={singleMarkeropen}
          setMarkerData={setMarkerData}
          markerData={markerData}
          setMarkerOption={setMarkerOption}
          markerOption={markerOption}
        />
      )}
      <MarkerPopup
        setShowMarkerPopup={setShowMarkerPopup}
        showMarkerPopup={showMarkerPopup}
        placeDetails={placeDetails}
        getSingleMapMarkers={getSingleMapMarkers}
        removalMarker={removalMarker}
      />

      <LoadingComponent loading={loading} />
    </div>
  );
};
export default ViewGoogleMap;
