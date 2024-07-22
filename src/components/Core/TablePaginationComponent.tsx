
import { Card, MenuItem, Pagination, Select, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const TablePaginationComponent = ({ paginationDetails, capturePageNum, captureRowPerItems, values }: any) => {

  const useParams = useSearchParams();
  const [pageNum, setPageNum] = useState<number | string>();
  const [noOfRows, setNoOfRows] = useState<number | string>(paginationDetails?.limit);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
  );

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
    );
  }, [useParams]);

  useEffect(() => {
    setNoOfRows(paginationDetails?.limit)
  }, [paginationDetails]);

  const handlePagerowChange = (event: any) => {
    setNoOfRows(event.target.value);
    captureRowPerItems(event.target.value)
    setPageNum(1);
  };

  const [limitOptions] = useState(

    [8, 12, 24, 48, 100]
  );

  return (
    <Card className="tablePagenationBlock">
      <div className="tablePagination" >
        <div className="rowPerPage">
          <Typography className="label">
            {values} Per Page
          </Typography>

          <Select
            className="selectComponent"
            value={noOfRows}
            onChange={handlePagerowChange}
            defaultValue={searchParams.limit ? searchParams.limit : 8}
            sx={{
              height: "25px !important",
              borderRadius: "3px !important",
              fontSize: "11px",
              border: "none",
            }}
          >
            {limitOptions.map((item: number) => (
              <MenuItem className="menuItem" value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>

        <Typography variant="caption" className="totalCount">
          {" "}
          {(paginationDetails?.page == 1
            ? 1
            : (paginationDetails?.page - 1) * paginationDetails?.limit + 1) +
            " - " +
            (paginationDetails?.page == paginationDetails?.total_pages
              ? paginationDetails?.total
              : paginationDetails?.total < paginationDetails?.limit
                ? paginationDetails?.total
                : paginationDetails?.page * paginationDetails?.limit)}{" "}
          of {paginationDetails?.total} {values}
        </Typography>


        <Pagination
          shape="rounded"
          sx={{
            "& .MuiButtonBase-root": {
              height: "25px !important",
              minWidth: "inherit",
            },
          }}
          page={paginationDetails?.page}
          count={paginationDetails?.total_pages}
          onChange={(event: any, value: any) => {
            capturePageNum(value);
            setPageNum(+value);
          }}
        />
      </div>
    </Card>
  );
}
export default TablePaginationComponent;