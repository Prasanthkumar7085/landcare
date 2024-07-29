"use client";
import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getAllListMapsAPI } from "@/services/maps";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Tooltip,
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
import Image from "next/image";

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
    from_date = searchParams?.from_date,
    to_date = searchParams?.to_date,
  }: Partial<ListMapsApiProps>) => {
    setLoading(true);
    try {
      let queryParams: any = {
        page: page ? page : 1,
        limit: limit ? limit : 8,
        search_string: search_string ? search_string : "",
        from_date: from_date ? from_date : "",
        to_date: to_date ? to_date : "",
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
      from_date: searchParams?.from_date,
      to_date: searchParams?.to_date,
    });
  }, [searchParams]);

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
    <div className="allMapsContainer">
      <MapsFilters getAllMaps={getAllMaps} mapsData={mapsData} />
      <Box>
        <div className="mapListContainer">
          {mapsData?.map((item: any, index: any) => (
            <Card className="eachListCard" key={index}>
              <div className="imgBlock">
                <Image
                  className="mapImg"
                  src={item?.image ? item?.image : "/no-image.png"}
                  alt="map image"
                  width={100}
                  height={150}
                />
              </div>
              <div className="cardContent">
                <Typography className="cardTitle">
                  <Tooltip
                    title={item?.title?.length >= 50 ? item?.title : ""}
                    placement="bottom"
                  >
                    {item?.title
                      ? item?.title?.length >= 50
                        ? `${item?.title.slice(0, 30)}....`
                        : item?.title
                      : "--"}
                  </Tooltip>
                </Typography>
                <Typography className="cardDesc">
                  <Tooltip
                    title={
                      item?.description?.length >= 50 ? item?.description : ""
                    }
                    placement="bottom"
                  >
                    {item?.description
                      ? item?.description?.length >= 50
                        ? `${item?.description.slice(0, 30)}....`
                        : item?.description
                      : "--"}
                  </Tooltip>
                </Typography>
              </div>

              <div className="cardFooter">
                <Typography className="createDate">
                  <Image src="/map/clock.svg" height={13} width={13} alt="" />
                  <span>
                    {item?.created_at ? datePipe(item?.created_at) : "--"}
                  </span>
                </Typography>
                <Button
                  className="previewBtn"
                  variant="text"
                  onClick={() => {
                    router.push(`/view-map/${item?.id}`);
                  }}
                >
                  <Image
                    src="/login/view-icon.svg"
                    height={13}
                    width={13}
                    alt=""
                  />
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </div>
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
