import GoogleMapReact from "google-map-react";

const GoogleMapComponent = ({ mapType, handleApiLoaded }: any) => {
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
