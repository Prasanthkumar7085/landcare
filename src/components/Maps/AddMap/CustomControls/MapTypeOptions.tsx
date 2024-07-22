export const MapTypeOptions = (map: any, maps: any, setMapType: any) => {
  //custom map type event
  const mapTypeControlEvent = () => {
    const controlDiv = document.createElement("div");

    const controlUI = document.createElement("div");
    controlUI.style.display = "flex";
    controlUI.style.flexDirection = "row";
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "10px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to toggle map type";
    controlDiv.appendChild(controlUI);

    // Create buttons for each map type
    const types = ["roadmap", "satellite", "hybrid"];
    types.forEach((type) => {
      const controlText = document.createElement("div");

      controlText.style.color = "rgb(25,25,25)";
      controlText.style.fontFamily = "Roboto,Arial,sans-serif";
      controlText.style.fontSize = "16px";
      controlText.style.lineHeight = "38px";
      controlText.style.padding = "0 5px";
      controlText.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
      controlUI.appendChild(controlText);

      controlText.addEventListener("click", () => {
        setMapType(type);
      });
    });

    return controlDiv;
  };

  const mapTypeControlDiv: any = document.createElement("div");
  const mapTypeControl = mapTypeControlEvent();
  mapTypeControlDiv.index = 1;
  map.controls[maps.ControlPosition.BOTTOM_CENTER].push(mapTypeControlDiv);
  mapTypeControlDiv.appendChild(mapTypeControl);
};
