export const addCustomControl = ({ map, maps, mapRef, infoWindowRef }: any) => {
  const controlDiv = document.createElement("div");
  const controlUI = document.createElement("img");

  controlUI.src = "/live-location.png";
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "1px solid #ccc";
  controlUI.style.padding = "5px";
  controlUI.style.cursor = "pointer";
  controlUI.style.textAlign = "center";
  controlUI.style.width = "23px";
  controlUI.style.height = "23px";
  controlUI.style.marginBottom = "2rem";
  controlUI.style.marginLeft = "-70px";
  controlUI.title = "Click to pan to current location";
  controlDiv.appendChild(controlUI);

  controlUI.addEventListener("click", () => {
    if (navigator.geolocation && mapRef.current) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          mapRef.current.panTo(currentPosition);
          mapRef.current.setZoom(15);

          const infoWindow = infoWindowRef.current;
          infoWindow.setPosition(currentPosition);
          infoWindow.setContent("Location found.");
          infoWindow.open(mapRef.current);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            default:
              console.error("An unknown error occurred.");
              break;
          }
        },
        options
      );
    } else {
      console.error("Geolocation is not supported");
    }
  });

  map.controls[maps.ControlPosition.BOTTOM_LEFT].push(controlDiv);
};
