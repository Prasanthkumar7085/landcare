import { copyURL } from "@/lib/helpers/copyURL";
import { datePipe } from "@/lib/helpers/datePipe";
import { getMarkersImagesBasedOnOrganizationType } from "@/lib/helpers/mapsHelpers";
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
}: any) => {
  return [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      enableSorting: false,
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "60px",
      cell: ({ row, table }: any) =>
        (table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow: any) => flatRow.id === row.id) || 0) +
        1,
    },
    {
      accessorFn: (row: any) => row.title,
      id: "title",
      header: () => <span>Title</span>,
      cell: (info: any) => {
        return <span>{info.getValue() ? info.getValue() : "--"}</span>;
      },
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.organisation_type,
      id: "organisation_type",
      sortDescFirst: false,
      cell: (info: any) => {
        let markersImages = getMarkersImagesBasedOnOrganizationType(markers);

        return (
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              width={15}
              height={15}
              src={
                info.getValue()
                  ? markersImages[info.getValue()]
                  : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
              }
              alt={info.getValue()}
            />
            {info.getValue() ? info.getValue() : "--"}
          </span>
        );
      },
      header: () => <span>Organisation Type</span>,
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
        return (
          <Tooltip title={value && value.length > 10 ? value : ""}>
            <span>{truncatedValue}</span>
          </Tooltip>
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
        return (
          <Tooltip title={value && value.length > 20 ? value : ""}>
            <Link href={value} target="_blank">
              {truncatedValue}
            </Link>
          </Tooltip>
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
      accessorFn: (row: any) => row.phone,
      id: "phone",
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
        <span>{info.getValue() ? `[${info.getValue()}]` : "--"}</span>
      ),
      header: () => <span>Coordinates</span>,
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
          <IconButton
            className="iconBtn"
            onClick={() => {
              handleClose();
              const markerEntry = markersRef.current.find(
                (entry: any) => entry.id === info?.row?.original?.id
              );
              if (markerEntry) {
                const { marker } = markerEntry;
                handleMarkerClick(info?.row?.original, marker);
              } else {
                console.error(`Marker with ID ${id} not found.`);
              }
            }}
          >
            <Image src="/map/table/view.svg" alt="" width={15} height={15} />
          </IconButton>

          <IconButton
            className="iconBtn"
            onClick={() => {
              setShareDialogOpen(true);
              setSingleMapDetails(info?.row?.original);
            }}
          >
            <Image src="/map/table/share.svg" alt="" width={15} height={15} />
          </IconButton>

          <IconButton
            className="iconBtn"
            onClick={() => {
              copyURL(
                `https://dev-landcare.vercel.app/landcare-map/${mapDetails?.slug}?marker_id=${singleMapDetails?.id}`
              );
            }}
          >
            <Image src="/map/table/copy.svg" alt="" width={15} height={15} />
          </IconButton>
          <IconButton
            className="iconBtn"
            onClick={() => {
              handleClickDeleteOpen(info?.row?.original?.id);
            }}
          >
            <Image src="/map/table/trash.svg" alt="" width={15} height={15} />
          </IconButton>
        </div>
      ),
      header: () => <span>ACTIONS</span>,
      footer: (props: any) => props.column.id,
      width: "110px",
    },
  ];
};
