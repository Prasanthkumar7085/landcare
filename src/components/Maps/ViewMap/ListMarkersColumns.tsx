import { datePipe } from "@/lib/helpers/datePipe";

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
    accessorFn: (row: any) => row.position,
    id: "position",
    sortDescFirst: false,
    cell: (info: any) => (
      <span>{info.getValue() ? info.getValue() : "--"}</span>
    ),
    header: () => <span>Position</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
  {
    accessorFn: (row: any) => row.host_organization,
    id: "host_organization",
    sortDescFirst: false,
    cell: (info: any) => (
      <span>{info.getValue() ? info.getValue() : "--"}</span>
    ),
    header: () => <span>Host Organization</span>,
    footer: (props: any) => props.column.id,
    width: "150px",
  },
  {
    accessorFn: (row: any) => row.location,
    id: "location",
    sortDescFirst: false,
    cell: (info: any) => (
      <span>{info.getValue() ? info.getValue() : "--"}</span>
    ),
    header: () => <span>Location</span>,
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
