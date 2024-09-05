import GoogleMapComponent from "@/components/Core/GoogleMap";
import LoadingComponent from "@/components/Core/LoadingComponent";
import ViewMarkerDrawer from "@/components/Maps/ViewMap/ViewMarkerDrawer";
import {
  boundToMapWithPolygon,
  getLocationAddress,
  getMarkersImagesBasedOnOrganizationType,
  getPolygonWithMarkers,
  navigateToMarker,
  renderer,
} from "@/lib/helpers/mapsHelpers";
import {
  getSingleMapDetailsAPI,
  getSingleMapMarkersAPI,
  getSingleMarkerAPI,
} from "@/services/maps";
import {
  Cluster,
  ClusterStats,
  Marker,
  MarkerClusterer,
} from "@googlemaps/markerclusterer";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MarkerPopup from "./AddMarker/AddMarkerFrom";
import styles from "./view-map.module.css";
import ViewMapDetailsDrawer from "./ViewMapDetailsBlock";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";

const ViewGoogleMap = () => {
  const { id } = useParams();
  const params = useSearchParams();
  const drawingManagerRef: any = useRef(null);
  const pathName = usePathname();
  const router = useRouter();
  let currentBouncingMarker: any = null;
  let markersRef = useRef<{ id: number; marker: google.maps.Marker }[]>([]);
  const bouncingMarkerRef = useRef<google.maps.Marker | null>(null);
  const clusterRef: any = useRef<any>(null);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [loading, setLoading] = useState(true);
  const [renderField, setRenderField] = useState(false);
  const [map, setMaps] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [mapDetails, setMapDetails] = useState<any>({});
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapRef, setMapRef] = useState<any>(null);
  const [singleMarkers, setSingleMarkers] = useState<any[]>([]);
  const [searchString, setSearchString] = useState(
    params.get("search_string")
      ? decodeURIComponent(params.get("search_string") as string)
      : "" || ""
  );
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [localMarkers, setLocalMarkers] = useState<any>([]);
  const [overlays, setOverlays] = useState<any[]>([]);
  const [singleMarkeropen, setSingleMarkerOpen] = useState(false);
  const [markerData, setMarkerData] = useState<any>({ images: "", tags: [] });
  const [markerOption, setMarkerOption] = useState<any>();
  const [singleMarkerdata, setSingleMarkerData] = useState<any>([]);
  const [singleMarkerLoading, setSingleMarkerLoading] = useState(false);
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
  const [allMarkers, setAllMarkers] = useState<any>([]);
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
    renderAllMarkers(markers, map, googleMaps);
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
    getLocationAddress({
      latitude,
      longitude,
      setMarkerData,
      setPlaceDetails,
      markerData,
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
        title: markerData.name,
        icon: {
          url: markersImagesWithOrganizationType[markerData?.type]
            ? markersImagesWithOrganizationType[markerData?.type]
            : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
        },
        animation:
          searchParams?.marker_id == markerData?.id
            ? google.maps.Animation.BOUNCE
            : google.maps.Animation.DROP,
        draggable: true,
      });
      markersRef.current.push({ id: markerData.id, marker: markere });

      markere.addListener("click", () => {
        handleMarkerClick(markerData, markere);
      });

      markere.addListener("dragstart", (event: google.maps.MouseEvent) => {});
      markere.addListener("dragend", async (event: google.maps.MouseEvent) => {
        setPlaceDetails({});
        setShowMarkerPopup(true);
        router.replace(`${pathName}?marker_id=${markerData?.id}`);
        const latitude = event.latLng?.lat();
        const longitude = event.latLng?.lng();
        await getSingleMarker(
          markerData?.id,
          markerData?.coordinates[0],
          markerData?.coordinates[1]
        );
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

  const handleMarkerClick = (markerData: any, markere: google.maps.Marker) => {
    let queries = { ...searchParams };
    delete queries.marker_id;
    let queryString = prepareURLEncodedParams("", queries);
    router.replace(`${pathName}${queryString}&marker_id=${markerData?.id}`);
    setPlaceDetails({});
    getSingleMarker(
      markerData?.id,
      markerData?.coordinates[0],
      markerData?.coordinates[1]
    );
    setSingleMarkerOpen(true);
    const isInCluster = markersRef.current.some(
      ({ marker }) => marker === markere
    );

    if (isInCluster) {
      let clusterBounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(({ marker }: any) => {
        if (marker.getPosition() && marker === markere) {
          clusterBounds.extend(marker.getPosition());
        }
      });

      if (clusterBounds.getNorthEast() && clusterBounds.getSouthWest()) {
        const center = clusterBounds.getCenter();
        map.setCenter(center);
      }
    } else {
      markere.setAnimation(google.maps.Animation.BOUNCE);
      bouncingMarkerRef.current = markere;
    }

    if (bouncingMarkerRef.current && bouncingMarkerRef.current !== markere) {
      bouncingMarkerRef.current.setAnimation(null);
    }
    markere.setAnimation(google.maps.Animation.BOUNCE);
    bouncingMarkerRef.current = markere;
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({ drawingControl: false });
    }
  };

  const getSingleMarker = async (marker_id: any, lat: any, lng: any) => {
    setSingleMarkerLoading(true);
    let markerID = marker_id;
    try {
      const response = await getSingleMarkerAPI(id, lat, lng);
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
  const OtherMapOptions = (map: any, maps: any) => {
    setMaps(map);
    setGoogleMaps(maps);
    const drawingManager = new maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: maps.ControlPosition.LEFT_TOP,
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
      const response = await getSingleMapDetailsAPI(id);
      if (response?.status == 200 || response?.status == 201) {
        setMapDetails(response?.data);
        const markersPromise = await getSingleMapMarkers({
          marker_id: params?.get("marker_id") || searchParams?.marker_id,
        });
        const organizationsPromise = await getSingleMapMarkersForOrginazations({
          id: response?.data?.id,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSingleMapMarkersForOrginazations = async ({ id }: any) => {
    try {
      let queryParams: any = { get_all: true, limited_datatypes: true };
      const response = await getSingleMapMarkersAPI(id, queryParams);
      const { data, ...rest } = response;
      setAllMarkers(data);
      let markersImages = getMarkersImagesBasedOnOrganizationType(data);
      setMarkersImagesWithOrganizationType(markersImages);
    } catch (err) {
      console.error(err);
    }
  };

  const getSingleMapMarkers = async ({
    search_string = searchParams?.search_string,
    sort_by = markerOption?.value,
    sort_type = markerOption?.title,
    type = searchParams?.organisation_type,
    marker_id,
  }: any) => {
    setFiltersLoading(true);
    try {
      let queryParams: any = {
        search_string: search_string ? search_string : "",
        sort_by: sort_by,
        sort_type: sort_type,
        get_all: true,
        type: type ? type : "",
      };
      let searchParamsDetails = {
        ...queryParams,
        marker_id: marker_id,
        search_string: search_string ? encodeURIComponent(search_string) : "",
      };
      let queryString = prepareURLEncodedParams("", searchParamsDetails);
      router.push(`${pathName}${queryString}`);
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
        (entry: any) => entry.id == params.get("marker_id")
      );
      let markerDetails = data?.find(
        (item: any) => item.id == params.get("marker_id")
      );
      if (markerEntry) {
        const { marker } = markerEntry;
        handleMarkerClick(markerDetails, marker);
      } else {
        console.error(`Marker with ID ${id} not found.`);
      }
    }
  };

  useEffect(() => {
    if (id) {
      getSingleMapDetails();
    }
  }, []);

  useEffect(() => {
    if (map && googleMaps) {
      if (!params?.get("marker_id") || !searchParams?.marker_id) {
        boundToMapWithPolygon(polygonCoords, map);
      } else {
        navigateToMarker(
          map,
          params?.get("marker_id") || searchParams?.marker_id,
          markers
        );
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
        className={styles.markersPageWeb}
        style={{
          display: loading == false ? "" : "none",
        }}
      >
        <div className={styles.googleMapBlock} id="markerGoogleMapBlock">
          <GoogleMapComponent OtherMapOptions={OtherMapOptions} />
        </div>

        {singleMarkeropen == true || params?.get("marker_id") ? (
          <ViewMarkerDrawer
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
            handleMarkerClick={handleMarkerClick}
            markersImagesWithOrganizationType={
              markersImagesWithOrganizationType
            }
            setPlaceDetails={setPlaceDetails}
            getSingleMarker={getSingleMarker}
            mapDetails={mapDetails}
            allMarkers={allMarkers}
            searchParams={searchParams}
          />
        ) : (
          <ViewMapDetailsDrawer
            mapDetails={mapDetails}
            singleMarkers={singleMarkers}
            setSearchString={setSearchString}
            searchString={searchString}
            setSingleMarkerOpen={setSingleMarkerOpen}
            setMarkerOption={setMarkerOption}
            markerOption={markerOption}
            getData={getSingleMapDetails}
            map={map}
            maps={googleMaps}
            markersRef={markersRef}
            handleMarkerClick={handleMarkerClick}
            getSingleMapMarkers={getSingleMapMarkers}
            markersImagesWithOrganizationType={
              markersImagesWithOrganizationType
            }
            setPolygonCoords={setPolygonCoords}
            setMapDetails={setMapDetails}
            selectedOrginazation={selectedOrginazation}
            setSelectedOrginazation={setSelectedOrginazation}
            getSingleMapMarkersForOrginazations={
              getSingleMapMarkersForOrginazations
            }
            allMarkers={allMarkers}
            searchParams={searchParams}
            drawingManagerRef={drawingManagerRef}
          />
        )}
        {showMarkerPopup && (
          <MarkerPopup
            setShowMarkerPopup={setShowMarkerPopup}
            showMarkerPopup={showMarkerPopup}
            placeDetails={placeDetails}
            getSingleMapMarkers={getSingleMapDetails}
            removalMarker={removalMarker}
            popupFormData={markerData}
            setPopupFormData={setMarkerData}
            setSingleMarkerData={setSingleMarkerData}
            getSingleMarker={getSingleMarker}
            mapDetails={mapDetails}
            allMarkers={allMarkers}
          />
        )}
      </div>
      <LoadingComponent
        loading={loading || singleMarkerLoading || filtersLoading}
      />
    </>
  );
};
export default ViewGoogleMap;
