import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { FC, useState, useEffect } from "react";

interface pageProps {
  columns: any[];
  data: any[];
  loading: boolean;
  getData: any;
  searchParams: any;
}

const TanstackTableComponent: FC<pageProps> = ({
  columns,
  data,
  getData,
  loading,
  searchParams,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  let removeSortingForColumnIds = ["id", "actions", "serial"];

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

  const sortAndGetData = (header: any) => {
    if (
      removeSortingForColumnIds &&
      removeSortingForColumnIds?.length &&
      removeSortingForColumnIds.includes(header.id)
    ) {
      return;
    }
    let sort_by = header.id;
    let sort_type = "asc";
    if ((searchParams?.sort_by as string) == header.id) {
      if (searchParams?.sort_type == "asc") {
        sort_type = "desc";
      } else {
        sort_by = "";
        sort_type = "";
      }
    }

    getData({
      ...searchParams,
      sort_by: sort_by,
      sort_type: sort_type,
    });
  };

  const getWidth = (id: string) => {
    const widthObj = columns.find((item: any) => item.id == id);
    const width = widthObj?.width;
    return width;
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
                        onClick={() => sortAndGetData(header)}
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
                        <SortItems
                          searchParams={searchParams}
                          header={header}
                          removeSortingForColumnIds={removeSortingForColumnIds}
                        />
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
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                    height={500}
                    width={300}
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

const SortItems = ({
  searchParams,
  header,
  removeSortingForColumnIds,
}: {
  searchParams: any;
  header: any;
  removeSortingForColumnIds?: string[];
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {searchParams.sort_by == header.id ? (
        searchParams.sort_type == "asc" ? (
          <Image src="/sort-asc.svg" height={13} width={13} alt="image" />
        ) : (
          <Image src="/sort-desc.svg" height={13} width={13} alt="image" />
        )
      ) : removeSortingForColumnIds?.includes(header.id) ? (
        ""
      ) : (
        <Image src="/un-sort.svg" height={13} width={15} alt="image" />
      )}
    </div>
  );
};
