import AutoCompleteSearch from "@/components/Core/AutoCompleteSearch";
import GoogleMapComponent from "@/components/Core/GoogleMap";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { markerFilterOptions } from "@/lib/constants/mapConstants";
import {
  boundToMapWithPolygon,
  getLocationAddress,
  getMarkersImagesBasedOnOrganizationType,
  getPolygonWithMarkers,
  renderer,
} from "@/lib/helpers/mapsHelpers";
import {
  getSingleMapDetailsAPI,
  getSingleMapDetailsBySlugAPI,
  getSingleMapMarkersAPI,
  getSingleMarkerAPI,
} from "@/services/maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { capitalize, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "../view-map.module.css";
import ViewPublicMarkerDrawer from "./ViewPublicMarkerDrawer";
import { capitalizeFirstLetter } from "@/lib/helpers/nameFormate";
import PublicMapFilters from "./PublicMapFilters";

const PublicMap = () => {
  const { slug } = useParams();
  const params = useSearchParams();
  const drawingManagerRef: any = useRef(null);
  const pathName = usePathname();
  const router = useRouter();
  let currentBouncingMarker: any = null;
  let markersRef = useRef<{ id: number; marker: google.maps.Marker }[]>([]);
  const clusterRef: any = useRef(null);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [loading, setLoading] = useState(true);
  const [map, setMaps] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [mapDetails, setMapDetails] = useState<any>({});
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [singleMarkers, setSingleMarkers] = useState<any[]>([]);
  const [searchString, setSearchString] = useState("");
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [localMarkers, setLocalMarkers] = useState<any>([]);
  const [overlays, setOverlays] = useState<any[]>([]);
  const [singleMarkeropen, setSingleMarkerOpen] = useState(false);
  const [markerOption, setMarkerOption] = useState<any>();
  const [singleMarkerdata, setSingleMarkerData] = useState<any>();
  const [singleMarkerLoading, setSingleMarkerLoading] = useState(false);
  const [markersOpen, setMarkersOpen] = useState<any>(false);
  const [markerData, setMarkerData] = useState<any>({ images: [], tags: [] });
  const [
    markersImagesWithOrganizationType,
    setMarkersImagesWithOrganizationType,
  ] = useState<any>({});
  const [selectedOrginazation, setSelectedOrginazation] = useState<any>(null);
  const [placeDetails, setPlaceDetails] = useState<any>({
    full_address: "",
    coordinates: [],
  });
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const bouncingMarkerRef = useRef<google.maps.Marker | null>(null);

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
          console.error("No results found");
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };
  const clearMarkers = () => {
    markersRef.current.forEach(({ marker }) => {
      marker.setMap(null);
    });
    if (clusterRef.current) {
      clusterRef.current.clearMarkers();
      clusterRef.current = null;
    }
    markersRef.current = [];
  };
  const renderAllMarkers = (markers1: any, map: any, maps: any) => {
    clearMarkers();
    markers1?.forEach((markerData: any, index: number) => {
      const latLng = new google.maps.LatLng(
        markerData.coordinates?.[0],
        markerData.coordinates?.[1]
      );
      const markere = new google.maps.Marker({
        position: latLng,
        map: map,
        title: markerData.title,
        icon: {
          url: markersImagesWithOrganizationType[markerData?.organisation_type]
            ? markersImagesWithOrganizationType[markerData?.organisation_type]
            : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
        },
        animation:
          searchParams?.marker_id == markerData?.id
            ? google.maps.Animation.BOUNCE
            : google.maps.Animation.DROP,
        draggable: false,
      });
      markersRef.current.push({ id: markerData.id, marker: markere });

      markere.addListener("click", () => {
        handleMarkerClick(markerData, markere);
      });

      markere.addListener("dragstart", (event: google.maps.MouseEvent) => {});
      markere.addListener("dragend", async (event: google.maps.MouseEvent) => {
        router.replace(`${pathName}?marker_id=${markerData?.id}`);
        const latitude = event.latLng?.lat();
        const longitude = event.latLng?.lng();
        await getSingleMarker(markerData?.id, latitude, longitude);
        setShowMarkerPopup(true);
        if (drawingManagerRef.current) {
          drawingManagerRef.current.setOptions({ drawingControl: false });
        }
        getLocationAddress({
          latitude,
          longitude,
          setMarkerData,
          setPlaceDetails,
          markerData,
        });
      });
    });
    clusterRef.current = new MarkerClusterer({
      markers: markersRef.current.map(({ marker }) => marker),
      map: map,
      renderer,
    });
    if (params.get("marker_id") || searchParams?.marker_id) {
      goTomarker(markers1);
    }
  };

  const getSingleMarker = async (marker_id: any, lat: any, lng: any) => {
    setSingleMarkerLoading(true);
    let markerID = marker_id;
    try {
      const response = await getSingleMarkerAPI(mapDetails?.id, lat, lng);
      let markerData = response?.data.find(
        (item: any) => item?.id == marker_id
      );
      setSingleMarkerData(response?.data);
      setMarkerData(markerData);
    } catch (err) {
      console.error(err);
    } finally {
      setSingleMarkerLoading(false);
    }
  };

  const handleMarkerClick = (markerData: any, markere: google.maps.Marker) => {
    router.replace(`${pathName}?marker_id=${markerData?.id}`);
    getSingleMarker(
      markerData?.id,
      markerData?.coordinates[0],
      markerData?.coordinates[1]
    );
    setSingleMarkerOpen(true);
    map.setCenter(
      new google.maps.LatLng(
        markerData?.coordinates[0],
        markerData?.coordinates[1]
      )
    );
    if (bouncingMarkerRef.current && bouncingMarkerRef.current !== markere) {
      bouncingMarkerRef.current.setAnimation(null);
    }
    if (markere.getAnimation() === google.maps.Animation.BOUNCE) {
      markere.setAnimation(null);
    } else {
      markere.setAnimation(google.maps.Animation.BOUNCE);
      bouncingMarkerRef.current = markere;
    }
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({ drawingControl: false });
    }
  };

  const OtherMapOptions = (map: any, maps: any) => {
    setMaps(map);
    setGoogleMaps(maps);
    const drawingManager = new maps.drawing.DrawingManager({
      drawingControl: false,
      drawingControlOptions: {
        position: maps.ControlPosition.LEFT_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.MARKER],
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;
    const newPolygon = new maps.Polygon({
      paths: [],
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
      const response = await getSingleMapDetailsBySlugAPI(slug);

      if (response?.status === 200 || response?.status === 201) {
        setMapDetails(response?.data);

        const mapId = response?.data?.id;
        const [markersForOrganizationsResult, markersResult] =
          await Promise.allSettled([
            getSingleMapMarkersForOrginazations({ id: mapId }),
            getSingleMapMarkers({ id: mapId }),
          ]);
      }
    } catch (err) {
      console.error("Error in getSingleMapDetails:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSingleMapMarkersForOrginazations = async ({ id }: any) => {
    try {
      let queryParams: any = { get_all: true, limited_datatypes: true };
      const response = await getSingleMapMarkersAPI(id, queryParams);
      const { data, ...rest } = response;
      let markersImages = getMarkersImagesBasedOnOrganizationType(data);
      setMarkersImagesWithOrganizationType(markersImages);
    } catch (err) {
      console.error(err);
    }
  };

  const getSingleMapMarkers = async ({
    search_string = searchString,
    sort_by = markerOption?.value,
    sort_type = markerOption?.title,
    id = mapDetails?.id,
    type = selectedOrginazation?.type,
  }) => {
    setFiltersLoading(true);
    try {
      let queryParams: any = {
        get_all: true,
        search_string: search_string,
        sort_by: sort_by,
        sort_type: sort_type,
        organisation_type: type ? type : "",
        limited_datatypes: true,
      };
      const response = await getSingleMapMarkersAPI(id, queryParams);
      const { data, ...rest } = response;
      setMarkers(data);
      setSingleMarkers(data);
      let updatedCoords = data?.map((item: any) => item.coordinates);
      let newCoords = updatedCoords.map((item: any) => {
        return {
          lat: item[0],
          lng: item[1],
        };
      });
      let coords = getPolygonWithMarkers(newCoords);
      setPolygonCoords(coords);
    } catch (err) {
      console.error(err);
    } finally {
      setFiltersLoading(false);
    }
  };

  const goTomarker = (data: any) => {
    if (params.get("marker_id") || searchParams?.marker_id) {
      const markerEntry = markersRef.current.find(
        (entry: any) =>
          entry.id == (params.get("marker_id") || searchParams?.marker_id)
      );
      let markerDetails = data?.find(
        (item: any) =>
          item.id == (params.get("marker_id") || searchParams?.marker_id)
      );
      if (markerEntry) {
        const { marker } = markerEntry;
        console.log(marker);
        handleMarkerClick(markerDetails, marker);
      } else {
        console.error(`Marker with ID ${mapDetails?.id} not found.`);
      }
    }
  };

  useEffect(() => {
    if (slug) {
      getSingleMapDetails();
    }
  }, []);

  useEffect(() => {
    if (map && googleMaps) {
      if (!params?.get("marker_id") || !searchParams?.marker_id) {
        boundToMapWithPolygon(polygonCoords, map);
      }
      renderAllMarkers(markers, map, googleMaps);
    }
  }, [map, googleMaps, markers]);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <>
      <div
        id="markersPageWithMap"
        className={styles.markersPageWeb}
        style={{
          display: loading == false ? "" : "none",
        }}
      >
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapComponent OtherMapOptions={OtherMapOptions} />
          <div
            className={styles.filterGrp}
            style={{
              position: "absolute",
              top: "20px",
              left: "30px",
              gap: "1.2rem ",
            }}
          >
            <PublicMapFilters
              searchString={searchString}
              setSearchString={setSearchString}
              markersImagesWithOrganizationType={
                markersImagesWithOrganizationType
              }
              setSelectedOrginazation={setSelectedOrginazation}
              selectedOrginazation={selectedOrginazation}
              getSingleMapMarkers={getSingleMapMarkers}
              setMarkers={setMarkers}
              setSingleMarkers={setSingleMarkers}
              markers={markers}
              singleMarkers={singleMarkers}
            />
          </div>
        </div>
        {singleMarkeropen == true || params?.get("marker_id") ? (
          <ViewPublicMarkerDrawer
            onClose={setSingleMarkerOpen}
            getSingleMapMarkers={getSingleMapMarkers}
            setShowMarkerPopup={setShowMarkerPopup}
            currentBouncingMarker={currentBouncingMarker}
            markersRef={markersRef}
            setMarkerData={setMarkerData}
            markerData={markerData}
            data={singleMarkerdata}
            setData={setSingleMarkerData}
            map={map}
            polygonCoords={polygonCoords}
            showMarkerPopup={showMarkerPopup}
            drawingManagerRef={drawingManagerRef}
            setSingleMarkerLoading={setSingleMarkerLoading}
            singleMarkerLoading={singleMarkerLoading}
            setMarkersOpen={setMarkersOpen}
            handleMarkerClick={handleMarkerClick}
            markersImagesWithOrganizationType={
              markersImagesWithOrganizationType
            }
            setPlaceDetails={setPlaceDetails}
            getSingleMarker={getSingleMarker}
            mapDetails={mapDetails}
          />
        ) : (
          ""
        )}
      </div>
      <LoadingComponent
        loading={loading || singleMarkerLoading || filtersLoading}
      />
    </>
  );
};
export default PublicMap;
