"use client";
import { ListMapsApiProps } from "@/interfaces/listMapsAPITypes";
import { copyEmbededIframeUrl, copyURL } from "@/lib/helpers/copyURL";
import { datePipe } from "@/lib/helpers/datePipe";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import {
  changeStatusOfMapAPI,
  deleteMapAPI,
  getAllListMapsAPI,
  getMapsCounts,
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
import { MapsController } from "../../../lib/controllers/mapsController";
import { truncateText } from "@/lib/helpers/nameFormate";

const Maps = () => {
  const params = useSearchParams();
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
  const [mapsCount, setMapsCount] = useState<any>([]);

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
    page = params.get("page") as string,
    limit = params.get("limit") as string,
    search_string = params.get("search_string") as string,
    from_date = params.get("from_date") as string,
    to_date = params.get("to_date") as string,
    status = params.get("status") as string,
    sort_by = params.get("sort_by") as string,
    sort_type = params.get("sort_type") as string,
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
        sort_by: sort_by ? sort_by : "",
        sort_type: sort_type ? sort_type : "",
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
      await countOfMaps(queryParams);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const countOfMaps = async (queryParams: any) => {
    let restParams = {
      ...queryParams,
    };
    delete restParams.status;
    try {
      const response: any = await getMapsCounts(restParams);
      let mapsCounts = {
        publish: response?.data?.find((item: any) => item.status == "publish")
          ?.count,
        draft: response?.data?.find((item: any) => item.status == "draft")
          ?.count,
      };
      setMapsCount(mapsCounts);
    } catch (err: any) {
      console.error(err);
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
      await getAllMaps({});
      handleDeleteCose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (event: any, id: any) => {
    event.stopPropagation();
    router.push(`/view-map/${id}`);
  };

  const handleShareClick = (event: any, item: any) => {
    event.stopPropagation();
    setShareMenuOpen(true);
    handleOpenUserMenu(event);
    setMapId(item?.id);
    setSingleMapDetails(item);
  };

  const handleMenuClick = (event: any, item: any) => {
    event.stopPropagation();
    handleOpenUserMenu(event);
    setMapId(item?.id);
    setSingleMapDetails(item);
  };

  const capturePageNum = (value: number) => {
    getAllMaps({
      limit: params.get("limit") as string,
      page: value,
    });
  };

  const captureRowPerItems = (value: number) => {
    getAllMaps({
      limit: value,
      page: 1,
    });
  };

  return (
    <div className="allMapsContainer">
      <MapsFilters
        getAllMaps={getAllMaps}
        mapsData={mapsData}
        mapsCount={mapsCount}
      />
      <Box>
        {mapsData?.length ? (
          <div className="mapListContainer">
            {mapsData.map((item: any, index) => (
              <Card className="eachListCard" key={index}>
                <div
                  className="imgBlock"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => handleImageClick(event, item?.id)}
                >
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
                  <div className="topStrip">
                    <Typography
                      className="stripTitle"
                      style={{
                        background:
                          item?.status == "publish" ? "#34a853" : "#F29900",
                        textTransform: "capitalize",
                      }}
                    >
                      {item?.status ? item?.status?.toLowerCase() : "--"}
                    </Typography>
                    <div className="iconsDiv">
                      {item?.status == "publish" ? (
                        <IconButton
                          className="iconBtn1"
                          onClick={(event) => handleShareClick(event, item)}
                        >
                          <Image
                            src="/map/share-bg.svg"
                            alt=""
                            height={30}
                            width={30}
                          />
                        </IconButton>
                      ) : (
                        ""
                      )}
                      <IconButton
                        className="iconBtn2"
                        onClick={(event) => handleMenuClick(event, item)}
                      >
                        <Image
                          src="/map/menu-bg.svg"
                          alt=""
                          height={30}
                          width={30}
                        />
                      </IconButton>
                    </div>
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

                  <Tooltip
                    title={
                      item?.description && item?.description?.length >= 200
                        ? item?.description
                        : ""
                    }
                  >
                    <Typography className="cardDesc">
                      {truncateText(item?.description, 200) || "---"}
                    </Typography>
                  </Tooltip>
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
                    onClick={() => router.push(`/view-map/${item?.id}`)}
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
        ) : (
          ""
        )}

        {!loading && mapsData?.length == 0 ? (
          <div className="noDataFound">
            {!mapsData?.length &&
            (params?.get("from_date") ||
              params?.get("to_date") ||
              params?.get("search_string")) ? (
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
        text="Are you sure you want to delete map?"
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
                  `https://dev-landcare.vercel.app/view-map/${singleMapDetails?.id}`,
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
