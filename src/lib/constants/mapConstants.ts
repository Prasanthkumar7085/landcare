export const mapTypeOptions = [
  {
    title: "Restaurants",
    label: "Restaurants",
    img: "/markers/Restaurants-marker.svg",
  },
  { title: "Parks", label: "Parks", img: "/markers/parks.svg" },
  {
    title: "Hosipitals",
    label: "Hosipitals",
    img: "/markers/hosipitals.svg",
  },
  {
    title: "Schools",
    label: "Schools",
    img: "/markers/schools.svg",
  },
  {
    title: "Pharmacies",
    label: "Pharmacies",
    img: "/markers/pharmacies.svg",
  },
  {
    title: "Gas Stations",
    label: "Gas Stations",
    img: "/markers/gasStation.svg",
  },
  {
    title: "Shopping Centers",
    label: "Shopping Centers",
    img: "/markers/shopping.svg",
  },
  {
    title: "Police Stations",
    label: "Police Stations",
    img: "/markers/policeStation.svg",
  },
  {
    title: "Libraries",
    label: "Libraries",
    img: "/markers/libraries.svg",
  },
  { title: "Gyms", label: "Gyms", img: "/markers/gyms.svg" },
  {
    title: "Cinemas",
    label: "Cinemas",
    img: "/markers/cinemas.svg",
  },
];

export const markerFilterOptions = [
  {
    title: "asc",
    value: "name",
    label: "Name (A to Z)",
  },
  {
    title: "dsc",
    value: "name",
    label: "Name (Z to A)",
  },
  {
    title: "asc",
    value: "created_at",
    label: "Newest First",
  },
  {
    title: "dsc",
    value: "created_at",
    label: "Oldest First",
  },
];
export const mapOptions = {
  styles: [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },

    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#e4e3df",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#9fd3d4",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#ffeb3b",
        },
      ],
    },
    // {
    //   featureType: "landscape.natural",
    //   elementType: "geometry",
    //   stylers: [
    //     {
    //       color: "#a2b08c",
    //     },
    //   ],
    // },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#4caf50",
        },
      ],
    },
  ],
  fullscreenControl: false,
  rotateControl: true,
  streetViewControl: true,
};
