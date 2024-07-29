import {
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface pageProps {
    columns: any[];
    data: any[];
    loading: boolean;
}
const TanstackTableComponent: FC<pageProps> = ({
    columns,
    data,
    loading,
}) => {
    const pathName = usePathname();
    const [sorting, setSorting] = useState<SortingState>([]);
    let removeSortingForColumnIds = [
        "id",
        "actions",
    ];

    const table = useReactTable({
        columns,
        data,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    const useParams = useSearchParams();
    const [searchParams, setSearchParams] = useState(
        Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
    );

    useEffect(() => {
        setSearchParams(
            Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
        );
    }, [useParams]);

    const getWidth = (id: string) => {
        const widthObj = columns.find((item: any) => item.id == id);
        const width = widthObj?.width;
        return width;
    };

    const getBackgroundColor = (totalCases: any, targetVolume: any) => {
        if (targetVolume === 0) {
            if (totalCases === 0) {
                return "#f5fff7"; // Both total cases and target volume are zero
            } else if (totalCases >= targetVolume) {
                return "#f5fff7"; // Both total cases and target volume are zero
            } else {
                return "#ffebe9";
            }
        }

        const percentage = totalCases / targetVolume;
        if (totalCases >= targetVolume) {
            return "#f5fff7"; // Green for completion
        } else if (percentage >= 0.5) {
            return "#feecd1"; // Orange for partial completion
        } else {
            return "#ffebe9"; // Red for incomplete
        }
    };
    return (
        <div
            style={{ width: "100%", overflowX: "auto" }}
        >
            <table style={{ width: "100%" }}>
                <thead
                    className="thead"
                    style={{
                        height: "32px",
                        position: "sticky",
                        top: "0px",
                        zIndex: "2",
                        color: "white",
                    }}
                >
                    {table
                        .getHeaderGroups()
                        .map((headerGroup: any, mainIndex: number) => (
                            <tr className="table-row" key={headerGroup.id}>
                                {headerGroup.headers.map((header: any, index: number) => {
                                    return (
                                        <th
                                            className="cell"
                                            key={index}
                                            colSpan={header.colSpan}
                                            style={{
                                                minWidth: getWidth(header.id),
                                                width: getWidth(header.id),
                                                color: "#000",
                                                background: "#F0EDFF",
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    // onClick={() => sortAndGetData(header)}
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? "cursor-pointer select-none"
                                                            : "",
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                    style={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        cursor: "pointer",
                                                        minWidth: getWidth(header.id),
                                                        width: getWidth(header.id),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: (
                                                            <Image
                                                                src="/sort-asc.svg"
                                                                height={8}
                                                                width={8}
                                                                alt="image"
                                                            />
                                                        ),
                                                        desc: (
                                                            <Image
                                                                src="/sort-desc.svg"
                                                                height={8}
                                                                width={8}
                                                                alt="image"
                                                            />
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? (
                                                            <Image
                                                                src="/un-sort.svg"
                                                                height={8}
                                                                width={8}
                                                                alt="Unsorted"
                                                                style={{
                                                                    display:
                                                                        header.id === "actions" ||
                                                                            removeSortingForColumnIds.includes(header.id)
                                                                            ? "none"
                                                                            : "",
                                                                }}
                                                            />
                                                        )}
                                                </div>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                </thead>
                <tbody className="tbody">
                    {data?.length ? (
                        table.getRowModel().rows.map((row: any, mainIndex: number) => {
                            return (
                                <tr className="table-row" key={mainIndex}>
                                    {row.getVisibleCells().map((cell: any, index: number) => {
                                        return (
                                            <td
                                                className="cell"
                                                key={index}
                                                style={{
                                                    width: "100%",
                                                    backgroundColor:
                                                        row?.original.hasOwnProperty("total_targets") &&
                                                            cell?.id &&
                                                            cell?.id.includes("total_cases")
                                                            ? getBackgroundColor(
                                                                row.original.total_cases,
                                                                row?.original?.dayTargets
                                                                    ? row?.original?.dayTargets
                                                                    : row?.original?.total_targets
                                                            )
                                                            : "",
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    ) : !loading ? (
                        <tr>
                            <td colSpan={10}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        src="/no-image-markers.svg"
                                        alt=""
                                        height={110}
                                        width={210}
                                    />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        ""
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default TanstackTableComponent;
