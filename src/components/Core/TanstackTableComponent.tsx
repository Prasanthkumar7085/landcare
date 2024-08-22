import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import Image from "next/image";
import { FC, useState, useEffect } from "react";

interface pageProps {
  columns: any[];
  data: any[];
  loading: boolean;
  getData: any;
}

const TanstackTableComponent: FC<pageProps> = ({ columns, data, getData, loading }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  let removeSortingForColumnIds = ["id", "actions"];

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

  // Handle sorting and call the getData function with the sort parameters
  useEffect(() => {
    if (sorting.length > 0) {
      const { id: sort_by, desc } = sorting[0];
      const sort_type = desc ? "desc" : "asc";
      getData({ sort_by, sort_type });
    } else {
      getData({ sort_by: "", sort_type: "" });
    }
  }, [sorting]);

  const getWidth = (id: string) => {
    const widthObj = columns.find((item: any) => item.id == id);
    const width = widthObj?.width;
    return width;
  };

  const getBackgroundColor = (totalCases: any, targetVolume: any) => {
    if (targetVolume === 0) {
      if (totalCases === 0) {
        return "#f5fff7";
      } else if (totalCases >= targetVolume) {
        return "#f5fff7";
      } else {
        return "#ffebe9";
      }
    }

    const percentage = totalCases / targetVolume;
    if (totalCases >= targetVolume) {
      return "#f5fff7";
    } else if (percentage >= 0.5) {
      return "#feecd1";
    } else {
      return "#ffebe9";
    }
  };

  return (
    <div className="tableContainer">
      <table className="table">
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
                {headerGroup.headers.map((header: any, index: number) => (
                  <th
                    className="cell"
                    key={index}
                    colSpan={header.colSpan}
                    style={{
                      minWidth: getWidth(header.id),
                      width: getWidth(header.id),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
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
                          alignItems: "center",
                          justifyContent: "space-between",
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
                              height={12}
                              width={12}
                              alt="image"
                            />
                          ),
                          desc: (
                            <Image
                              src="/sort-desc.svg"
                              height={12}
                              width={12}
                              alt="image"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <Image
                            src="/un-sort.svg"
                            height={12}
                            width={12}
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
                ))}
              </tr>
            ))}
        </thead>
        <tbody className="tbody">
          {data?.length ? (
            table.getRowModel().rows.map((row: any, mainIndex: number) => (
              <tr className="table-row" key={mainIndex}>
                {row.getVisibleCells().map((cell: any, index: number) => (
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
                ))}
              </tr>
            ))
          ) : !loading ? (
            <tr>
              <td colSpan={10}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                  }}
                >
                  <Image
                    src="/no-image-markers.svg"
                    alt=""
                    height={130}
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
