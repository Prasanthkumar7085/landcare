import GoogleMapReact from "google-map-react";
import { useRef, useState } from "react";
import { addCustomControl } from "../Maps/AddMap/CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "../Maps/AddMap/CustomControls/MapTypeOptions";
import { SearchAutoComplete } from "../Maps/AddMap/CustomControls/SearchAutoComplete";

const GoogleMapComponent = ({ OtherMapOptions }: any) => {
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);
  const [mapType, setMapType] = useState("hybrid");

  const handleApiLoaded = (map: any, maps: any) => {
    mapRef.current = map;
    addCustomControl({ map, maps, mapRef, infoWindowRef });
    MapTypeOptions(map, maps, setMapType);
    SearchAutoComplete({
      placesService,
      maps,
      map,
      mapRef,
    });
    OtherMapOptions(map, maps);
  };
  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        libraries: ["drawing", "places"],
      }}
      defaultCenter={{
        lat: 20.5937,
        lng: 78.9629,
      }}
      options={{
        mapTypeId: mapType,
        fullscreenControl: false,
        rotateControl: true,
        streetViewControl: true,
      }}
      defaultZoom={6}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
    ></GoogleMapReact>
  );
};
export default GoogleMapComponent;
