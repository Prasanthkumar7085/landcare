export const SearchAutoComplete = ({
  placesService,
  maps,
  map,
  mapRef,
}: any) => {
  placesService.current = new maps.places.PlacesService(map);

  const customAutocompleteDiv = document.createElement("div");
  customAutocompleteDiv.style.position = "relative";
  customAutocompleteDiv.style.width = "20%";
  const searchInput = document.createElement("input");
  searchInput.setAttribute("id", "searchInput");
  searchInput.setAttribute("placeholder", "Search for a place...");
  searchInput.setAttribute("value", "");
  searchInput.style.marginTop = "10px";
  searchInput.style.marginLeft = "2.5px";
  searchInput.style.padding = "13px";
  searchInput.style.width = "calc(100% - 32px)";

  searchInput.style.borderRadius = "10px";
  searchInput.style.overflow = "hidden";
  searchInput.style.textOverflow = "ellipsis";

  // Create a custom icon
  const icon = document.createElement("div");
  icon.innerHTML = "&#10060;";
  icon.style.position = "absolute";
  icon.style.top = "61%";
  icon.style.left = "87%";
  icon.style.transform = "translateY(-50%)";
  icon.style.padding = "10px";
  icon.style.cursor = "pointer";
  icon.style.display = searchInput.value ? "block" : "none";

  // Attach click event to the icon
  icon.addEventListener("click", () => {
    searchInput.value = "";
    icon.style.display = "none";
  });

  searchInput.addEventListener("input", () => {
    icon.style.display = searchInput.value ? "block" : "none";
  });

  customAutocompleteDiv.appendChild(searchInput);
  customAutocompleteDiv.appendChild(icon);

  map.controls[maps.ControlPosition.TOP_LEFT].push(customAutocompleteDiv);
  const autocomplete = new maps.places.Autocomplete(searchInput, {
    placeAutocompleteOptions: { strictBounds: false },
  });

  const onPlaceChanged = () => {
    const place = autocomplete.getPlace();
    console.log(place, "yes rewiqj");
    if (!place.geometry || !place.geometry.location) {
      console.error("No place data available");
      return;
    }

    let location = place.formatted_address.split(",");
    centerMapToPlace(place, mapRef);
  };

  autocomplete.addListener("place_changed", onPlaceChanged);
};
const centerMapToPlace = (place: any, mapRef: any) => {
  if (mapRef.current && place?.geometry && place.geometry.viewport) {
    const viewport = place.geometry.viewport;

    mapRef.current.fitBounds(viewport);

    const maxZoom = 14;
    const zoom = mapRef.current.getZoom();
    if (zoom > maxZoom) {
      mapRef.current.setZoom(maxZoom);
    }
  } else {
    console.error("Invalid place object or viewport not available");
  }
};
