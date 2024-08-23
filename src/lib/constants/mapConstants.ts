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

export const mapsFilterOptions = [
  {
    title: "asc",
    value: "title",
    label: "Title (A to Z)",
  },
  {
    title: "desc",
    value: "title",
    label: "Title (Z to A)",
  },
  {
    title: "desc",
    value: "created_at",
    label: "Newest First",
  },
  {
    title: "asc",
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

export const subHeadersMappingConstants: any = {
  Title: "title",
  Description: "description",
  "Organisation Type": "organisation_type",
  "Postal Address": "postal_address",
  Images: "images",
  "Street Address": "street_address",
  Town: "town",
  Postcode: "postcode",
  "Phone number": "phone",
  Fax: "fax",
  Email: "email",
  Website: "website",
  Contact: "contact",
  Tags: "tags",
  Location: "coordinates",
};

export const SheetHeaders = [
  "Title",
  "Description",
  "Organisation Type",
  "Postal Address",
  "Images",
  "Street Address",
  "Town",
  "Postcode",
  "Phone number",
  "Fax",
  "Email",
  "Website",
  "Contact",
  "Tags",
  "Location",
];

export const markersImages = [
  "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
  "https://maps.gstatic.com/mapfiles/ms2/micons/ltblue-dot.png",
  "https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png",
  "https://maps.gstatic.com/mapfiles/ms2/micons/purple-dot.png",
  "https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png",
  "/markers/pharmacies.svg",
  "/markers/gasStation.svg",
  "/markers/shopping.svg",
  "/markers/policeStation.svg",
  "/markers/libraries.svg",
  "/markers/gyms.svg",
  "/markers/cinemas.svg",
  "/markers/extra-marker1.svg",
  "/markers/extra-marker2.svg",
  "/markers/extra-marker3.svg",
  "/markers/extra-marker4.svg",
  "/markers/extra-marker5.svg",
  "/markers/extra-marker6.svg",
];
