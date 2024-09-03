import { datePipe } from "@/lib/helpers/datePipe";
import {
  getMarkersImagesBasedOnOrganizationType,
  navigateToMarker,
} from "@/lib/helpers/mapsHelpers";
import { truncateText } from "@/lib/helpers/nameFormate";
import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export const ListMarkersColumns = ({
  handleClose,
  setShareDialogOpen,
  setSingleMapDetails,
  handleClickDeleteOpen,
  singleMapDetails,
  markersRef,
  handleMarkerClick,
  id,
  markers,
  mapDetails,
  markersImagesWithOrganizationType,
  map,
}: any) => {
  return [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.name,
      id: "name",
      header: () => <span>Name</span>,
      cell: (info: any) => {
        return <span>{info.getValue() ? info.getValue() : "--"}</span>;
      },
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.type,
      id: "type",
      sortDescFirst: false,
      cell: (info: any) => {
        let markersImages = getMarkersImagesBasedOnOrganizationType(markers);

        return (
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            <img
              width={15}
              height={15}
              src={
                info.getValue()
                  ? markersImagesWithOrganizationType[info.getValue()]
                  : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
              }
              alt={info.getValue()}
            />
            {info.getValue() ? info.getValue() : "--"}
          </span>
        );
      },
      header: () => <span>Type</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.description,
      id: "description",
      sortDescFirst: false,
      cell: (info: any) => {
        const value = info.getValue();
        const truncatedValue = truncateText(value, 10);
        return value ? (
          <Tooltip title={value && value.length > 10 ? value : ""}>
            <span>{truncatedValue}</span>
          </Tooltip>
        ) : (
          ""
        );
      },
      header: () => <span>Description</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.website,
      id: "website",
      sortDescFirst: false,
      cell: (info: any) => {
        const value = info.getValue();
        const truncatedValue = truncateText(value, 20);
        return info.getValue() ? (
          <Tooltip title={value && value.length > 20 ? value : ""}>
            <Link href={value} target="_blank">
              {truncatedValue}
            </Link>
          </Tooltip>
        ) : (
          "---"
        );
      },
      header: () => <span>Website</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.contact,
      id: "contact",
      sortDescFirst: false,
      cell: (info: any) => (
        <span>{info.getValue() ? info.getValue() : "--"}</span>
      ),
      header: () => <span>Contact</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.phone_number,
      id: "phone_number",
      sortDescFirst: false,
      cell: (info: any) => (
        <span>{info.getValue() ? info.getValue() : "--"}</span>
      ),
      header: () => <span>Phone</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.email,
      id: "email",
      sortDescFirst: false,
      cell: (info: any) => (
        <span>{info.getValue() ? info.getValue() : "--"}</span>
      ),
      header: () => <span>Email</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.postcode,
      id: "postcode",
      sortDescFirst: false,
      cell: (info: any) => (
        <span>{info.getValue() ? info.getValue() : "--"}</span>
      ),
      header: () => <span>Post Code</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.town,
      id: "town",
      sortDescFirst: false,
      cell: (info: any) => (
        <span>{info.getValue() ? info.getValue() : "--"}</span>
      ),
      header: () => <span>Town</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },

    {
      accessorFn: (row: any) => row.coordinates,
      id: "coordinates",
      sortDescFirst: false,
      cell: (info: any) => (
        <span>{info.getValue() ? `${info.getValue()}` : "--"}</span>
      ),
      header: () => <span>Latitude Longitude</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.created_at,
      sortDescFirst: false,
      id: "created_at",
      cell: (info: any) => (
        <span>{datePipe(info.getValue() ? info.getValue() : "--")}</span>
      ),
      header: () => <span>CREATED ON</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row,
      sortDescFirst: false,
      id: "actions",
      cell: (info: any) => (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Tooltip title="View" followCursor>
            <IconButton
              className="iconBtn"
              onClick={() => {
                handleClose();
                const markerEntry = markersRef.current.find(
                  (entry: any) => entry.id === info?.row?.original?.id
                );
                if (markerEntry) {
                  const { marker } = markerEntry;
                  navigateToMarker(map, info?.row?.original?.id, [
                    info?.row?.original,
                  ]);
                  handleMarkerClick(info?.row?.original, marker);
                } else {
                  console.error(`Marker with ID ${id} not found.`);
                }
              }}
            >
              <Image src="/map/table/view.svg" alt="" width={15} height={15} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" followCursor>
            <IconButton
              className="iconBtn"
              onClick={() => {
                handleClickDeleteOpen(info?.row?.original?.id);
              }}
            >
              <Image src="/map/table/trash.svg" alt="" width={15} height={15} />
            </IconButton>
          </Tooltip>
        </div>
      ),
      header: () => <span>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "110px",
    },
  ];
};
