import { datePipe } from "@/lib/helpers/datePipe";
import { truncateText } from "@/lib/helpers/nameFormate";
import { Tooltip } from "@mui/material";
import Link from "next/link";

export const ListMarkersColumns = [
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
    cell: (info: any) => (
      <span>{info.getValue() ? info.getValue() : "--"}</span>
    ),
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
];
