"use client";
import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getAllListMapsAPI } from "@/services/maps";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import TablePaginationComponent from "../Core/TablePaginationComponent";
import MapsFilters from "./MapsFilters";
import { datePipe } from "@/lib/helpers/datePipe";
import LoadingComponent from "../Core/LoadingComponent";

const Maps = () => {
  const useParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [mapsData, setMapsData] = useState<any[]>([]);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(useParam.entries())))
  );

  const getAllMaps = async ({
    page = searchParams?.page,
    limit = searchParams?.limit,
    search_string = searchParams?.search_string,
  }: Partial<ListMapsApiProps>) => {
    setLoading(true);
    try {
      let queryParams: any = {
        page: page ? page : 1,
        limit: limit ? limit : 8,
        search_string: search_string ? search_string : "",
      };
      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathname}${queryString}`);
      const response = await getAllListMapsAPI(queryParams);
      const { data, ...rest } = response;
      setMapsData(data);
      setPaginationDetails(rest);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(useParam.entries())))
    );
  }, [useParam]);

  useEffect(() => {
    getAllMaps({
      page: searchParams?.page ? searchParams?.page : 1,
      limit: searchParams?.limit ? searchParams?.limit : 8,
      search_string: searchParams?.search_string,
    });
  }, [searchParams?.page, searchParams?.limit, searchParams?.search_string]);

  const capturePageNum = (value: number) => {
    getAllMaps({
      ...searchParams,
      limit: searchParams.limit as string,
      page: value,
    });
  };

  const captureRowPerItems = (value: number) => {
    getAllMaps({
      ...searchParams,
      limit: value,
      page: 1,
    });
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <MapsFilters />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {mapsData?.map((item: any, index: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <img
                    style={{ width: "100%", height: "auto", marginBottom: 10 }}
                    src="data:image/png;base64,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"
                    alt="Red dot"
                  />
                  <Typography variant="body2" component="div" gutterBottom>
                    {item?.title ? item?.title : "--"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item?.description ? item?.description : "--"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item?.created_at ? datePipe(item?.created_at) : "--"}
                  </Typography>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="text"
                      sx={{ color: "black" }}
                      onClick={() => {
                        router.push(`/view-map/${item?.id}`);
                      }}
                    >
                      <VisibilityOutlinedIcon /> Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {mapsData?.length ? (
          <>
            {!loading ? (
              <TablePaginationComponent
                paginationDetails={paginationDetails}
                capturePageNum={capturePageNum}
                captureRowPerItems={captureRowPerItems}
                values="Maps"
              />
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </Box>
      <LoadingComponent loading={loading} />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default Maps;
