// export const SearchAutoComplete = ({
//   placesService,
//   maps,
//   map,
//   mapRef,
// }: any) => {
//   placesService.current = new maps.places.PlacesService(map);

//   const customAutocompleteDiv = document.createElement("div");
//   const inputDiv = document.createElement("div");

//   customAutocompleteDiv.style.position = "relative";
//   customAutocompleteDiv.style.width = "20%";
//   customAutocompleteDiv.style.minWidth = "220px";
//   const searchInput = document.createElement("input");
//   searchInput.setAttribute("id", "searchInput");
//   searchInput.setAttribute("placeholder", "Search for a place...");
//   searchInput.setAttribute("value", "");
//   searchInput.style.padding = "8px 13px";
//   searchInput.style.fontSize = "clamp(12px, 0.72vw, 14px)";
//   searchInput.style.width = "calc(100% - 32px)";
//   searchInput.style.border = "1px solid black";
//   searchInput.style.fontFamily = "Poppins";
//   searchInput.style.borderRadius = "6px";
//   searchInput.style.overflow = "hidden";
//   searchInput.style.textOverflow = "ellipsis";

//   // Create a custom icon
//   const icon = document.createElement("div");
//   icon.innerHTML = "&#10060;";
//   icon.style.position = "absolute";
//   icon.style.bottom = "2px";
//   icon.style.right = "8px";
//   icon.style.padding = "10px";
//   icon.style.cursor = "pointer";
//   icon.style.display = searchInput.value ? "block" : "none";
//   inputDiv.style.position = "relative";
//   inputDiv.style.marginTop = "2rem";
//   inputDiv.style.marginLeft = "2rem";

//   // Attach click event to the icon
//   icon.addEventListener("click", () => {
//     searchInput.value = "";
//     icon.style.display = "none";
//   });

//   searchInput.addEventListener("input", () => {
//     icon.style.display = searchInput.value ? "block" : "none";
//   });
//   inputDiv.appendChild(searchInput)
//   inputDiv.appendChild(icon)
//   customAutocompleteDiv.appendChild(inputDiv);

//   map.controls[maps.ControlPosition.TOP_LEFT].push(customAutocompleteDiv);
//   const autocomplete = new maps.places.Autocomplete(searchInput, {
//     placeAutocompleteOptions: { strictBounds: false },
//   });

//   const onPlaceChanged = () => {
//     const place = autocomplete.getPlace();
//     if (!place.geometry || !place.geometry.location) {
//       console.error("No place data available");
//       return;
//     }

//     let location = place.formatted_address.split(",");
//     centerMapToPlace(place, mapRef);
//   };

//   autocomplete.addListener("place_changed", onPlaceChanged);
// };
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
