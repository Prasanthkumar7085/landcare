import {
  Card,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TablePaginationComponent = ({
  paginationDetails,
  capturePageNum,
  captureRowPerItems,
  values,
}: any) => {
  const useParams = useSearchParams();
  const [pageNum, setPageNum] = useState<number | string>();
  const [noOfRows, setNoOfRows] = useState<number | string>(
    paginationDetails?.limit
  );
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
  );
  const [pageValue, setPageValue] = useState(paginationDetails?.page);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(useParams.entries())))
    );
  }, [useParams]);

  useEffect(() => {
    setNoOfRows(paginationDetails?.limit);
  }, [paginationDetails]);

  const handlePagerowChange = (event: any) => {
    setNoOfRows(event.target.value);
    captureRowPerItems(event.target.value);
    setPageNum(1);
  };
  const [totalPages, setTotalPages] = useState(0);
  const [limitOptions] = useState([12, 24, 48, 100]);

  const onKeyDownInPageChange = (e: any) => {
    if (e.key == "Enter") {
      if (pageValue <= 0) {
        capturePageNum(1);
      } else if (
        paginationDetails?.total_pages &&
        pageValue >= paginationDetails?.total_pages
      ) {
        capturePageNum(paginationDetails?.total_pages);
      } else if (totalPages && pageValue >= totalPages) {
        capturePageNum(totalPages);
      } else {
        capturePageNum(pageValue);
      }
    }
  };

  useEffect(() => {
    setPageValue(paginationDetails?.page);

    if (paginationDetails?.count && !paginationDetails?.total_pages) {
      const pagesCount = Math.ceil(
        +paginationDetails?.count / +paginationDetails?.limit
      );
      setTotalPages(pagesCount);
    }
  }, [paginationDetails]);

  return (
    <Card className="tablePagenationBlock">
      <div className="tablePagination">
        <div className="rowPerPage">
          <Typography className="label">{values} Per Page</Typography>

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
            MenuProps={{
              PaperProps: {
                sx: {
                  top: "490px !important",
                },
              },
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

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Pagination
            shape="rounded"
            sx={{
              "& .MuiButtonBase-root": {
                height: "25px !important",
                minWidth: "25px",
              },
            }}
            page={paginationDetails?.page}
            count={paginationDetails?.total_pages}
            onChange={(event: any, value: any) => {
              capturePageNum(value);
              setPageNum(+value);
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              color: "#606266",
            }}
          >
            Go to
          </Typography>
          <TextField
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            type="number"
            value={pageValue}
            onChange={(e: any) => setPageValue(e.target.value)}
            onKeyDown={onKeyDownInPageChange}
            onWheel={(e: any) => e.target.blur()}
            sx={{
              "& .MuiInputBase-input": {
                padding: "2px",
                width: "45px",
                height: "25px",
                textAlign: "center",
              },
            }}
          ></TextField>
        </div>
      </div>
    </Card>
  );
};
export default TablePaginationComponent;
