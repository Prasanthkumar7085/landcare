import GoogleMapReact from "google-map-react";
import { useRef, useState } from "react";
import { addCustomControl } from "../Maps/AddMap/CustomControls/NavigationOnMaps";
import { MapTypeOptions } from "../Maps/AddMap/CustomControls/MapTypeOptions";
import { SearchAutoComplete } from "../Maps/AddMap/CustomControls/SearchAutoComplete";

const GoogleMapComponent = ({ OtherMapOptions, markers }: any) => {
  console.log(markers, "dpp3200320032");
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

  const Marker = ({ text }: any) => (
    <div
      style={{
        color: "white",
        background: "blue",
        padding: "10px 15px",
        display: "inline-flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "100%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {text}
    </div>
  );
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
    >
      {markers?.map((marker: any, index: any) => (
        <Marker
          key={index}
          lat={22.9288203647487}
          lng={81.92789885758059}
          text={marker?.type}
        />
      ))}
    </GoogleMapReact>
  );
};
export default GoogleMapComponent;
