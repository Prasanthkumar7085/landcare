import GoogleMapReact from "google-map-react";
import { useEffect, useRef, useState } from "react";
import { addCustomControl } from "../Maps/AddMap/CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "../Maps/AddMap/CustomControls/MapTypeOptions";
// import { SearchAutoComplete } from "../Maps/AddMap/CustomControls/SearchAutoComplete";
import { mapOptions } from "@/lib/constants/mapConstants";

const GoogleMapComponent = ({ OtherMapOptions }: any) => {
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);
  const [mapType, setMapType] = useState("roadmap");

  const createInfoWindow = (map: any) => {
    const infoWindow = new (window as any).google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;
  };

  const handleApiLoaded = (map: any, maps: any) => {
    mapRef.current = map;
    createInfoWindow(map);
    addCustomControl({ map, maps, mapRef, infoWindowRef });
    MapTypeOptions(map, maps, setMapType);
    // SearchAutoComplete({
    //   placesService,
    //   maps,
    //   map,
    //   mapRef,
    // });
    OtherMapOptions(map, maps);
  };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        libraries: ["drawing", "places", "geometry"],
      }}
      defaultCenter={{
        lat: -25.1198163,
        lng: 135.9791755,
      }}
      options={{ ...mapOptions, mapTypeId: mapType }}
      defaultZoom={6}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
    ></GoogleMapReact>
  );
};
export default GoogleMapComponent;
