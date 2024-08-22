"use client";
import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { copyEmbededIframeUrl, copyURL } from "@/lib/helpers/copyURL";
import { datePipe } from "@/lib/helpers/datePipe";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  changeStatusOfMapAPI,
  deleteMapAPI,
  getAllListMapsAPI,
} from "@/services/maps";
import {
  Box,
  Button,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteDialog from "../Core/DeleteDialog";
import LoadingComponent from "../Core/LoadingComponent";
import ShareLinkDialog from "../Core/ShareLinkDialog";
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
  const [singleMapDetails, setSingleMapDetails] = useState<any>({});
  const [shareLinkDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [shareMenuOpen, setShareMenuOpen] = useState<any>(false);
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(useParam.entries())))
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setShareMenuOpen(false);
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
    status = searchParams?.status,
    sort_by = searchParams?.sort_by,
    sort_type = searchParams?.sort_type
  }: Partial<ListMapsApiProps>) => {
    setLoading(true);
    try {
      let queryParams: any = {
        page: page ? page : 1,
        limit: limit ? limit : 12,
        search_string: search_string ? search_string : "",
        from_date: from_date ? from_date : "",
        to_date: to_date ? to_date : "",
        status: status ? status : "",
        sort_by : sort_by ? sort_by : "",
    sort_type : sort_type ? sort_type : "",
      };
      let searchParams = {
        ...queryParams,
        search_string: search_string ? encodeURIComponent(search_string) : "",
      };
      let queryString = prepareURLEncodedParams("", searchParams);

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
  const changeStatusOfMap = async (changedStatus: string) => {
    setLoading(true);
    let body = {
      status: changedStatus,
    };
    try {
      const response = await changeStatusOfMapAPI(mapId, body);
      toast.success(response?.message);
      getAllMaps({});
      handleDeleteCose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMaps({
      page: searchParams?.page ? searchParams?.page : 1,
      limit: searchParams?.limit ? searchParams?.limit : 12,
      search_string: searchParams?.search_string,
      from_date: searchParams?.from_date,
      to_date: searchParams?.to_date,
      status: searchParams?.status,
      sort_by: searchParams?.sort_by,
    sort_type: searchParams?.sort_type
    });
  }, [
    searchParams?.status,
    searchParams?.page,
    searchParams?.limit,
    searchParams?.from_date,
    searchParams?.to_date,
  ]);

  useEffect(() => {
    if (searchParams?.search_string) {
      const debounce = setTimeout(() => {
        getAllMaps({
          page: searchParams?.page ? searchParams?.page : 1,
          limit: searchParams?.limit ? searchParams?.limit : 8,
          search_string: searchParams?.search_string,
          from_date: searchParams?.from_date,
          to_date: searchParams?.to_date,
          status: searchParams?.status,
        });
      }, 1000);
      return () => clearTimeout(debounce);
    }
  }, [searchParams?.search_string]);

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

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(useParam.entries())))
    );
  }, [useParam]);
  return (
    <div className="allMapsContainer">
      <MapsFilters getAllMaps={getAllMaps} mapsData={mapsData} />
      <Box>
        {mapsData?.length ? (
          <div className="mapListContainer">
            {mapsData?.length
              ? mapsData.map((item: any, index: number) => {
                  return (
                    <Card className="eachListCard" key={index}>
                      <div className="imgBlock">
                        <Image
                          className="mapImg"
                          style={{
                            objectFit: item?.image ? "cover" : "contain",
                          }}
                          src={item?.image ? item?.image : "/no-image.png"}
                          alt="map image"
                          width={100}
                          height={150}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            className="iconBtn1"
                            onClick={(event) => {
                              setShareMenuOpen(true);
                              handleOpenUserMenu(event);
                              setMapId(item?.id);
                              setSingleMapDetails(item);
                            }}
                          >
                            <Image
                              src="/map/redo-arrow-icon.svg"
                              alt=""
                              height={18}
                              width={18}
                            />
                          </IconButton>
                          <IconButton
                            className="iconBtn2"
                            onClick={(event) => {
                              handleOpenUserMenu(event);
                              setMapId(item?.id);
                              setSingleMapDetails(item);
                            }}
                          >
                            <Image
                              src="/map/white-menu-bg.svg"
                              alt=""
                              height={25}
                              width={25}
                            />
                          </IconButton>
                        </div>
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
                        <Typography className="cardTitle">
                            {item?.status ? item?.status : "--"}
                        </Typography>
                        <Typography className="cardDesc">
                          <Tooltip
                            title={
                              item?.description?.length >= 50
                                ? item?.description
                                : ""
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
                          <Image
                            src="/map/clock.svg"
                            height={13}
                            width={13}
                            alt=""
                          />
                          <span>
                            {item?.created_at
                              ? datePipe(item?.created_at)
                              : "--"}
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
              : ""}
          </div>
        ) : (
          ""
        )}

        {!loading && mapsData?.length == 0 ? (
          <div className="noDataFound">
            {!mapsData?.length &&
            (useParam?.get("from_date") ||
              useParam?.get("to_date") ||
              useParam?.get("search_string")) ? (
              <>
                <Image
                  src="/no-image-maps.svg"
                  alt=""
                  height={400}
                  width={400}
                />
              </>
            ) : (
              <>
                <Image
                  src="/add-map-image.svg"
                  alt=""
                  height={300}
                  width={300}
                />
                <p>{"No maps added yet. Click 'Add New' to start."}</p>
              </>
            )}
          </div>
        ) : (
          ""
        )}
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
      <ShareLinkDialog
        open={shareLinkDialogOpen}
        setShareDialogOpen={setShareDialogOpen}
        mapDetails={singleMapDetails}
        linkToShare={`https://dev-landcare.vercel.app/landcare-map/${singleMapDetails?.slug}`}
      />

      <Menu
        sx={{ mt: "30px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {!shareMenuOpen && Boolean(anchorElUser) ? (
          <div>
            <MenuItem
              className="menuItem"
              onClick={() => {
                window.open(
                  `https://dev-landcare.vercel.app/landcare-map/${singleMapDetails?.slug}`,
                  "_blank"
                );
                handleCloseUserMenu();
              }}
            >
              Open In New Tab
            </MenuItem>

            <MenuItem
              className="menuItem"
              onClick={() => {
                copyURL(
                  `https://dev-landcare.vercel.app/landcare-map/${singleMapDetails?.slug}`
                );
                handleCloseUserMenu();
              }}
            >
              Copy
            </MenuItem>
            <MenuItem
              className="menuItem"
              onClick={() => {
                handleCloseUserMenu();
                handleClickDeleteOpen();
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              className="menuItem"
              onClick={() => {
                let changedStatus =
                  singleMapDetails?.status == "draft" ? "publish" : "draft";
                changeStatusOfMap(changedStatus);
                handleCloseUserMenu();
              }}
            >
              {singleMapDetails?.status == "draft"
                ? "Move to published"
                : "Move to draft"}
            </MenuItem>
          </div>
        ) : (
          <div style={{ display: Boolean(anchorElUser) ? "" : "none" }}>
            <MenuItem
              className="menuItem"
              onClick={() => {
                handleCloseUserMenu();
                setShareDialogOpen(true);
              }}
            >
              Share Link
            </MenuItem>
            <MenuItem
              className="menuItem"
              onClick={() => {
                const linkToEmdeded = `<iframe src=https://dev-landcare.vercel.app/landcare-map/${singleMapDetails?.slug} width="600" height="450" style="border:0;"
       loading="lazy"
       referrerpolicy="no-referrer-when-downgrade"
     ></iframe>`;
                copyEmbededIframeUrl(linkToEmdeded);
                handleCloseUserMenu();
              }}
            >
              Copy Embeded Url
            </MenuItem>
          </div>
        )}
      </Menu>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default Maps;
