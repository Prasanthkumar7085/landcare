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
        enableHighAccuracy: true, // Request high accuracy if available
        timeout: 5000, // Set a timeout (milliseconds) for the request
        maximumAge: 0, // Force a fresh location request
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          mapRef.current.panTo(currentPosition);
          mapRef.current.setZoom(15); // Optionally set the zoom level as needed

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
        options // Pass the options to getCurrentPosition
      );
    } else {
      console.error("Geolocation is not supported");
    }
  });

  map.controls[maps.ControlPosition.BOTTOM_LEFT].push(controlDiv);
};
