"use client";
import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getAllListMapsAPI } from "@/services/maps";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
                    alt=""
                    src="/map-location.png"
                    style={{ width: "100%", height: "auto", marginBottom: 10 }}
                  />
                  <Typography variant="body2" component="div" gutterBottom>
                    {item?.title || "--"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item?.description || "--"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {datePipe(item?.created_at) || "--"}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default Maps;
