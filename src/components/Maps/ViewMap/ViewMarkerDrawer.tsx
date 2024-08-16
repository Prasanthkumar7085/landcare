import DeleteDialog from "@/components/Core/DeleteDialog";
import ShareLinkDialog from "@/components/Core/ShareLinkDialog";
import { boundToMapWithPolygon } from "@/lib/helpers/mapsHelpers";
import { truncateText } from "@/lib/helpers/nameFormate";
import { deleteMarkerAPI, getSingleMarkerAPI } from "@/services/maps";
import { Menu, MenuItem, Tooltip } from "@mui/material";
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data?.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data?.images.length - 1 : prevIndex - 1
    );
  };

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
      getSingleMapMarkers({});
      handleDeleteCose();
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
            router.replace(`${pathname}`);
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
          }}
        >
          Back
        </Button>
      </header>
      {data?.map((item: any, index: any) => {
        return (
          <Box className="viewContent" key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: "0px",
              }}
            >
              <IconButton
                className="iconBtn"
                onClick={(e) => {
                  setSelectedMarker(item);
                  handleClick(e);
                }}
              >
                <Image
                  src="/map/menu-with-bg.svg"
                  alt=""
                  height={28}
                  width={28}
                />
              </IconButton>
            </div>
            <div className="imgBlock">
              {item?.images?.length > 0 ? (
                <div
                  style={{
                    minWidth: "100%",
                    width: "100%",
                    minHeight: "90%",
                    border: "1px solid black",
                  }}
                >
                  <button
                    onClick={prevSlide}
                    className="navButton"
                    style={{ display: item?.images?.length == 1 ? "none" : "" }}
                  >
                    &#10094;
                  </button>
                  <img
                    className="mapImg"
                    src={item?.images[currentIndex]}
                    alt={`images ${currentIndex}`}
                    height={90}
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    onClick={nextSlide}
                    className="navButton"
                    style={{ display: item?.images?.length == 1 ? "none" : "" }}
                  >
                    &#10095;
                  </button>
                </div>
              ) : (
                <img
                  className="mapImg"
                  src="/no-images.jpg"
                  alt="Fallback"
                  height={100}
                  width={100}
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className="headerDetails">
              {singleMarkerLoading ? (
                <Skeleton width="60%" className="markerTitle" />
              ) : (
                <Typography className="markerTitle">
                  {item?.title || "---"}
                </Typography>
              )}

              <Typography className="markerLocation">
                <Image
                  src="/map/location-blue.svg"
                  alt=""
                  width={10}
                  height={10}
                />
                {singleMarkerLoading ? (
                  <Skeleton width="60%" />
                ) : (
                  <span>{item?.town?.split(" ")[0] || "---"}</span>
                )}
              </Typography>
            </div>
            <div className="eachMarkerDetail">
              <Typography className="title">Description</Typography>
              {singleMarkerLoading ? (
                <Skeleton width="60%" />
              ) : (
                <Tooltip
                  title={
                    item?.description && item?.description?.length >= 200
                      ? item?.description
                      : ""
                  }
                >
                  <Typography className="value">
                    {truncateText(item?.description, 200) || "---"}
                  </Typography>
                </Tooltip>
              )}
            </div>
            <div className="eachMarkerDetail">
              <Typography className="title">Organization Type</Typography>
              {singleMarkerLoading ? (
                <Skeleton width="60%" />
              ) : (
                <Typography
                  className="value"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <img
                    width={15}
                    height={15}
                    style={{ display: item?.organisation_type ? "" : "none" }}
                    src={
                      item?.organisation_type
                        ? markersImagesWithOrganizationType[
                            item?.organisation_type
                          ]
                        : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
                    }
                    alt={item?.organisation_type}
                  />
                  {item?.organisation_type || "---"}
                </Typography>
              )}
            </div>
            <div className="eachMarkerDetail">
              <Typography className="title">website</Typography>
              {singleMarkerLoading ? (
                <Skeleton width="60%" />
              ) : item?.website ? (
                <Tooltip
                  title={
                    item?.website && item?.website?.length > 70
                      ? item?.website
                      : ""
                  }
                >
                  <Link href={item?.website} target="_blank" className="value">
                    {truncateText(item?.website, 70) || "---"}
                  </Link>
                </Tooltip>
              ) : (
                "---"
              )}
            </div>
            <div className="eachMarkerDetail">
              <Typography className="title">Postcode</Typography>
              {singleMarkerLoading ? (
                <Skeleton width="60%" />
              ) : (
                <Typography className="value">
                  {item?.postcode || "---"}{" "}
                </Typography>
              )}
            </div>
            <div className="headerDetails">
              {singleMarkerLoading ? (
                <Skeleton width="60%" />
              ) : (
                <Typography className="footerText">
                  <Image src="/map/email.svg" alt="" width={12} height={12} />
                  <span>{item?.email || "---"} </span>
                </Typography>
              )}
              {singleMarkerLoading ? (
                <Skeleton width="30%" />
              ) : (
                <Typography className="footerText">
                  <Image
                    src="/map/cell-icon.svg"
                    alt=""
                    width={12}
                    height={12}
                  />
                  <span>{item?.phone || "---"} </span>
                </Typography>
              )}
            </div>
            <div className="btnGrp">
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
                    handleMarkerClick(item, marker);
                  } else {
                    console.error(`Marker with ID ${id} not found.`);
                  }
                }}
              >
                {item ? "Navigate" : <Skeleton width="100%" />}
              </Button>
              <IconButton
                className="iconBtn"
                onClick={() => {
                  setShareDialogOpen(true);
                }}
              >
                {item ? (
                  <Image
                    src="/map/share-white.svg"
                    alt=""
                    width={13}
                    height={13}
                  />
                ) : (
                  <Skeleton variant="circular" width={13} height={13} />
                )}
              </IconButton>
            </div>
          </Box>
        );
      })}

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
        linkToShare={`https://dev-landcare.vercel.app/landcare-map/${id}?marker_id=${params?.get(
          "marker_id"
        )}`}
      />
      <DeleteDialog
        deleteOpen={deleteOpen}
        handleDeleteCose={handleDeleteCose}
        deleteFunction={deleteMarker}
        lable="Delete Marker"
        text="Are you sure want to delete marker?"
        loading={loading}
      />
    </div>
  );
};

export default ViewMarkerDrawer;
