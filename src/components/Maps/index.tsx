"use client";
import { deleteMapAPI, getAllListMapsAPI } from "@/services/maps";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { copyURL } from "@/lib/helpers/copyURL";
import { datePipe } from "@/lib/helpers/datePipe";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import DeleteDialog from "../Core/DeleteDialog";
import LoadingComponent from "../Core/LoadingComponent";
import TablePaginationComponent from "../Core/TablePaginationComponent";
import MapsFilters from "./MapsFilters";

const Maps = () => {
  const useParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [mapsData, setMapsData] = useState<any[]>([]);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [mapId, setMapId] = useState<any>();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(useParam.entries())))
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteCose = () => {
    setDeleteOpen(false);
  };

  const getAllMaps = async ({
    page = searchParams?.page,
    limit = searchParams?.limit,
    search_string = searchParams?.search_string,
    from_date = searchParams?.from_date,
    to_date = searchParams?.to_date,
    status = searchParams?.status
  }: Partial<ListMapsApiProps>) => {
    setLoading(true);
    try {
      let queryParams: any = {
        page: page ? page : 1,
        limit: limit ? limit : 8,
        search_string: search_string ? search_string : "",
        from_date: from_date ? from_date : "",
        to_date: to_date ? to_date : "",
        status: status ? status : "",
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

  const deleteMap = async () => {
    setShowLoading(true);
    try {
      const response = await deleteMapAPI(mapId);
      toast.success(response?.message);
      getAllMaps({});
      handleDeleteCose();
    } catch (err) {
      console.error(err);
    } finally {
      setShowLoading(false);
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
      status: searchParams?.status
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
          {mapsData?.length ? (
            mapsData.map((item: any, index: number) => {
              return (

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
                  <IconButton onClick={(event) => {
                    handleOpenUserMenu(event)
                    setMapId(item?.id)
                  }}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem className="menuItem" onClick={handleCloseUserMenu}>
                      Open In New Tab
                    </MenuItem>
                    <MenuItem className="menuItem" onClick={() => {
                      copyURL(mapId);
                      handleCloseUserMenu();
                    }}>
                      Copy
                    </MenuItem>
                    <MenuItem className="menuItem" onClick={() => {
                      handleCloseUserMenu();
                      handleClickDeleteOpen();
                    }}>
                      Delete
                    </MenuItem>
                  </Menu>
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
              );
            })
          ) : !loading ? (
            <div style={{ margin: 'auto' }}>
              {!mapsData?.length && (useParam?.get('from_date') || useParam?.get('to_date') || useParam?.get('search_string')) ? (
                <>
                  <Image src="/no-image-maps.svg" alt="" height={400} width={400} />
                </>
              ) : (
                <>
                  <Image src="/add-map-image.svg" alt="" height={300} width={300} />
                  <p >
                    {"No maps added yet. Click 'Add New' to start."}
                  </p>
                  <Button
                    variant="outlined"
                    onClick={() => router.push("/add-map")}
                    endIcon={<AddIcon />}
                  >
                    Add New Map
                  </Button>
                </>
              )}
            </div>
          ) : (
            ""
          )}
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
      <DeleteDialog
        deleteOpen={deleteOpen}
        handleDeleteCose={handleDeleteCose}
        deleteFunction={deleteMap}
        lable="Delete Map"
        text="Are you sure want to delete map?"
        loading={showLoading}
      />
      <LoadingComponent loading={loading} />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default Maps;
