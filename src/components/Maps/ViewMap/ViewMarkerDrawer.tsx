import DeleteDialog from "@/components/Core/DeleteDialog";
import ShareLinkDialog from "@/components/Core/ShareLinkDialog";
import {
  boundToMapWithPolygon,
  navigateToMarker,
  updateMapWithCordinatesHelper,
} from "@/lib/helpers/mapsHelpers";
import { truncateText } from "@/lib/helpers/nameFormate";
import { deleteMarkerAPI, getSingleMarkerAPI } from "@/services/maps";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MarkerDetailsAccordian from "./MarkerDetailsAccordian";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import ImageComponent from "@/components/Core/ImageComponent";

const ViewMarkerDrawer = ({
  onClose,
  getSingleMapMarkers,
  setShowMarkerPopup,
  markersRef,
  setMarkerData,
  data,
  setData,
  map,
  polygonCoords,
  showMarkerPopup,
  drawingManagerRef,
  setSingleMarkerLoading,
  singleMarkerLoading,
  handleMarkerClick,
  markersImagesWithOrganizationType,
  setPlaceDetails,
  getSingleMarker,
  mapDetails,
  allMarkers,
  searchParams,
}: any) => {
  const { id } = useParams();
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [shareLinkDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedMarker, setSelectedMarker] = useState<any>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteCose = () => {
    setDeleteOpen(false);
  };

  const deleteMarker = async () => {
    setLoading(true);
    try {
      const response = await deleteMarkerAPI(id, selectedMarker?.id);
      toast.success(response?.message);
      onClose();
      router.replace(`/view-map/${id}`);
      getSingleMapMarkers({ marker_id: "" });
      handleDeleteCose();
      let filtermarkers = allMarkers?.filter(
        (item: any) => item?.id !== selectedMarker?.id
      );
      await updateMapWithCordinatesHelper({
        deleteall: false,
        allMarkers: filtermarkers,
        mapDetails: mapDetails,
        id: id,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signleMarkerView">
      <header className="header">
        <Button
          className="backBtn"
          startIcon={
            <Image src="/map/map-backBtn.svg" alt="" height={15} width={15} />
          }
          onClick={() => {
            setMarkerData({});
            markersRef.current.forEach(({ marker }: any) => {
              if (marker.getAnimation() === google.maps.Animation.BOUNCE) {
                marker.setAnimation(null);
              }
            });
            boundToMapWithPolygon(polygonCoords, map);
            if (drawingManagerRef.current) {
              drawingManagerRef.current.setOptions({ drawingControl: true });
            }
            onClose();
            setData([]);
            let queries = { ...searchParams };
            delete queries.marker_id;
            let queryString = prepareURLEncodedParams("", queries);
            router.replace(`${pathname}${queryString}`);
          }}
        >
          Back
        </Button>
      </header>
      <div className="markerViewContent">
        {data?.map((item: any, index: any) => {
          return (
            <Box className="viewContent" key={index}>
              <div className="imgBlock">
                {item?.image ? (
                  <div
                    style={{
                      minWidth: "100%",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      className="mapImg"
                      src={item?.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/No-Preview-1.jpg";
                      }}
                      alt={`image`}
                    />
                  </div>
                ) : (
                  <Image
                    className="mapImg"
                    src="/no-images.jpg"
                    alt="Fallback"
                    height={100}
                    width={100}
                    style={{ objectFit: "contain" }}
                  />
                )}
                <IconButton
                  className="iconBtnMenu"
                  onClick={(e) => {
                    setSelectedMarker(item);
                    handleClick(e);
                  }}
                >
                  <Image
                    src="/map/menu-with-bg.svg"
                    alt=""
                    height={25}
                    width={25}
                  />
                </IconButton>
              </div>
              {data?.length > 1 ? (
                <MarkerDetailsAccordian
                  singleMarkerLoading={singleMarkerLoading}
                  item={item}
                  index={index}
                  markersImagesWithOrganizationType={
                    markersImagesWithOrganizationType
                  }
                  markersRef={markersRef}
                  handleMarkerClick={handleMarkerClick}
                  map={map}
                />
              ) : (
                <div className="contentBlock">
                  {singleMarkerLoading ? (
                    <Skeleton width="60%" className="markerTitle" />
                  ) : (
                    <Typography
                      className="markerTitle"
                      sx={{ display: item?.name ? "" : "none" }}
                    >
                      {item?.name || "---"}
                    </Typography>
                  )}

                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{
                        display: item?.description ? "" : "none !important",
                      }}
                    >
                      {item?.description || "---"}
                    </Typography>
                  )}

                  <Typography
                    className="markerLocation"
                    sx={{ display: item?.town ? "" : "none !important" }}
                  >
                    <Image
                      src="/map/view/location-view.svg"
                      alt=""
                      width={18}
                      height={18}
                    />
                    {singleMarkerLoading ? (
                      <Skeleton width="60%" />
                    ) : (
                      <span>{item?.town || "---"}</span>
                    )}
                  </Typography>

                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="tagValue"
                      sx={{
                        display:
                          item?.tags?.length > 0 ? "" : "none !important",
                      }}
                    >
                      <Image
                        src="/map/view/tag-view.svg"
                        alt=""
                        width={18}
                        height={18}
                      />

                      {item?.tags?.length > 0
                        ? item?.tags.map((tag: any, index: number) => {
                            return (
                              <span className="tagText" key={index}>
                                {tag}
                              </span>
                            );
                          })
                        : "---"}
                    </Typography>
                  )}

                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{
                        textTransform: "capitalize",
                        display: item?.type ? "" : "none !important",
                      }}
                    >
                      <img
                        className="markerTypeImg"
                        width={12}
                        height={12}
                        style={{
                          display: item?.type ? "" : "none",
                        }}
                        src={
                          item?.type
                            ? markersImagesWithOrganizationType[item?.type]
                            : ""
                        }
                        alt={item?.type}
                      />
                      <span>{item?.type || "---"}</span>
                    </Typography>
                  )}

                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <span
                      className="value"
                      style={{
                        display: item?.website?.length ? "" : "none",
                      }}
                    >
                      <Image
                        src="/map/view/website-view.svg"
                        alt=""
                        width={18}
                        height={18}
                      />

                      <Link
                        href={item?.website ? item?.website : "#"}
                        target="_blank"
                        className="value"
                        style={{ textDecoration: "none", marginBottom: "0" }}
                      >
                        {item?.website || "--"}
                      </Link>
                    </span>
                  )}

                  <Typography
                    style={{
                      display: item?.contact ? "" : "none",
                    }}
                  >
                    {singleMarkerLoading ? (
                      <Skeleton width="60%" />
                    ) : (
                      <span className="value">
                        <Image
                          src="/map/view/group-view.svg"
                          alt=""
                          width={18}
                          height={18}
                        />
                        <span>{item?.contact || "---"}</span>
                      </span>
                    )}
                  </Typography>
                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{
                        textTransform: "capitalize",
                        display: item?.host ? "" : "none !important",
                      }}
                    >
                      <Image
                        width={18}
                        height={18}
                        style={{
                          display: item?.host ? "" : "none",
                        }}
                        src="/map/view/host-view.svg"
                        alt={item?.host}
                      />
                      <span>{item?.host || "---"}</span>
                    </Typography>
                  )}
                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{
                        textTransform: "capitalize",
                        display: item?.host_type ? "" : "none !important",
                      }}
                    >
                      <Image
                        width={18}
                        height={18}
                        style={{
                          display: item?.host_type ? "" : "none",
                        }}
                        src="/map/view/host-view.svg"
                        alt={item?.host_type}
                      />
                      <span>{item?.host_type || "---"}</span>
                    </Typography>
                  )}

                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{
                        textTransform: "capitalize",
                        display: item?.landcare_region ? "" : "none !important",
                      }}
                    >
                      <Image
                        width={18}
                        height={18}
                        style={{
                          display: item?.landcare_region ? "" : "none",
                        }}
                        src="/map/view/land-view.svg"
                        alt={item?.landcare_region}
                      />
                      <span>{item?.landcare_region || "---"}</span>
                    </Typography>
                  )}

                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{ display: item?.postcode ? "" : "none !important" }}
                    >
                      <Image
                        src="/map/view/postal-view.svg"
                        alt=""
                        width={18}
                        height={18}
                      />
                      <span>{item?.postcode || "---"} </span>
                    </Typography>
                  )}

                  {singleMarkerLoading ? (
                    <Skeleton width="60%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{ display: item?.email ? "" : "none !important" }}
                    >
                      <Image
                        src="/map/view/email-view.svg"
                        alt=""
                        width={18}
                        height={18}
                      />
                      <span>{item?.email || "---"} </span>
                    </Typography>
                  )}

                  {singleMarkerLoading ? (
                    <Skeleton width="30%" />
                  ) : (
                    <Typography
                      className="value"
                      sx={{
                        display: item?.phone_number ? "" : "none !important",
                      }}
                    >
                      <Image
                        src="/map/view/mobile-view.svg"
                        alt=""
                        width={18}
                        height={18}
                      />
                      <span>{item?.phone_number || "---"} </span>
                    </Typography>
                  )}

                  <div
                    className="btnGrp"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                  >
                    <div className="share-icons">
                      <IconButton
                        className={"icon"}
                        aria-label="facebook"
                        onClick={() => window.open(item?.facebook)}
                        sx={{
                          display: item?.facebook ? "" : "none !important",
                        }}
                      >
                        <Image
                          src="/map/view/fb.svg"
                          alt=""
                          height={23}
                          width={23}
                        />
                      </IconButton>
                      <IconButton
                        className={"icon"}
                        aria-label="whatsapp"
                        onClick={() => window.open(item?.instagram)}
                        sx={{
                          display: item?.instagram ? "" : "none !important",
                        }}
                      >
                        <Image
                          src="/map/view/insta.svg"
                          alt=""
                          height={23}
                          width={23}
                        />
                      </IconButton>

                      <IconButton
                        className={"icon"}
                        aria-label="twitter"
                        sx={{ display: item?.twitter ? "" : "none !important" }}
                        onClick={() => window.open(item?.twitter)}
                      >
                        <Image
                          src="/map/view/twit.svg"
                          alt=""
                          height={23}
                          width={23}
                        />
                      </IconButton>
                      <IconButton
                        className={"icon"}
                        aria-label="email"
                        onClick={() => window.open(item?.youtube)}
                        sx={{ display: item?.youtube ? "" : "none !important" }}
                      >
                        <Image
                          src="/map/view/youtube.svg"
                          alt=""
                          height={23}
                          width={23}
                        />
                      </IconButton>
                    </div>
                    <Button
                      className="navigateBtn"
                      variant="contained"
                      endIcon={
                        <Image
                          src="/map/navigate.svg"
                          alt=""
                          width={15}
                          height={15}
                        />
                      }
                      onClick={() => {
                        const markerEntry = markersRef.current.find(
                          (entry: any) => entry.id === item?.id
                        );
                        if (markerEntry) {
                          const { marker } = markerEntry;
                          navigateToMarker(map, item?.id, [item]);
                          handleMarkerClick(item, marker);
                        } else {
                          console.error(`Marker with ID  not found.`);
                        }
                      }}
                    >
                      {item ? "Navigate" : <Skeleton width="100%" />}
                    </Button>
                  </div>
                </div>
              )}
            </Box>
          );
        })}
      </div>

      <Menu
        sx={{ mt: 1 }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          className="menuItem"
          onClick={() => {
            getSingleMarker(
              selectedMarker?.id,
              selectedMarker?.coordinates[0],
              selectedMarker?.coordinates[1]
            );
            setShowMarkerPopup(true);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          className="menuItem"
          onClick={() => {
            handleClickDeleteOpen();
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <ShareLinkDialog
        open={shareLinkDialogOpen}
        setShareDialogOpen={setShareDialogOpen}
        mapDetails={selectedMarker}
        linkToShare={`https://v2-landcare.vercel.app/map/${
          mapDetails?.slug
        }?marker_id=${params?.get("marker_id")}`}
      />
      <DeleteDialog
        deleteOpen={deleteOpen}
        handleDeleteCose={handleDeleteCose}
        deleteFunction={deleteMarker}
        lable="Delete Marker"
        text="Are you sure you want to delete the marker?"
        loading={loading}
      />
    </div>
  );
};

export default ViewMarkerDrawer;
