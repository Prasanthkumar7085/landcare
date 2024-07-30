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
        accessorFn: (row: any) => row.title,
        id: "title",
        header: () => <span>NAME</span>,
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
        cell: (info: any) => (
            <span>{info.getValue() ? info.getValue() : "--"}</span>
        ),
        header: () => <span>CATEGORY</span>,
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
        accessorFn: (row: any) => row.coordinates,
        sortDescFirst: false,
        id: "coordinates",
        cell: (info: any) => {
            return (
                <span>
                    {info.getValue() ? info.getValue().join(", ") : "--"}
                </span>
            );
        },
        header: () => <span>LATITUDE LONGITUDE</span>,
        footer: (props: any) => props.column.id,
        width: "150px",
    },
    {
        accessorFn: (row: any) => row.description,
        sortDescFirst: false,
        id: "description",
        cell: (info: any) => {
            return (
                <span>
                    {info.getValue() ? info.getValue() : "--"}
                </span>
            );
        },
        header: () => <span>DESCRIPTION</span>,
        footer: (props: any) => props.column.id,
        width: "150px",
    },
];