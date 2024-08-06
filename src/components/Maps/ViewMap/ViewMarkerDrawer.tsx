import DeleteDialog from "@/components/Core/DeleteDialog";
import ShareLinkDialog from "@/components/Core/ShareLinkDialog";
import { boundToMapWithPolygon } from "@/lib/helpers/mapsHelpers";
import { deleteMarkerAPI, getSingleMarkerAPI } from "@/services/maps";
import { Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
}: any) => {
  const { id } = useParams();
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [shareLinkDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const getSingleMarker = async (marker_id: any) => {
    setSingleMarkerLoading(true);
    let markerID = marker_id;
    try {
      const response = await getSingleMarkerAPI(id, markerID);
      setData(response?.data);
      setMarkerData(response?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSingleMarkerLoading(false);
    }
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
      const response = await deleteMarkerAPI(id, data?.id);
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

  useEffect(() => {
    if (params?.get("marker_id")) {
      getSingleMarker(params?.get("marker_id"));
    }
  }, [params?.get("marker_id"), showMarkerPopup]);
  return (
    <div className="signleMarkerView">
      <header className="header">
        <Button
          className="backBtn"
          startIcon={
            <Image src="/map/map-backBtn.svg" alt="" height={15} width={15} />
          }
          onClick={() => {
            onClose();
            setData({});
            router.replace(`${pathname}`);
            markersRef.current.forEach(({ marker }: any) => {
              if (marker.getAnimation() === google.maps.Animation.BOUNCE) {
                marker.setAnimation(null);
              }
            });
            boundToMapWithPolygon(polygonCoords, map);
            if (drawingManagerRef.current && params?.get("marker_id")) {
              drawingManagerRef.current.setOptions({ drawingControl: true });
            }
            setMarkerData({});
          }}
        >
          Back
        </Button>

        <IconButton className="iconBtn" onClick={handleClick}>
          <Image src="/map/menu-with-bg.svg" alt="" height={28} width={28} />
        </IconButton>
      </header>
      <Box className="viewContent">
        {/* <div className="imgBlock">
          <img
            className="mapImg"
            src={
              data?.images?.length > 0
                ? data?.images[0]
                : "/map/marker-view.png"
            }
            alt=""
            height={100}
            width={100}
          />
        </div> */}
        <div className="imgBlock">
          {data?.images?.length > 0 ? (
            <>
              <button onClick={prevSlide} className="navButton">
                &#10094;
              </button>
              <img
                className="mapImg"
                src={data?.images[currentIndex]}
                alt={`Slide ${currentIndex}`}
                height={100}
                width={100}
                style={{ objectFit: "cover" }}
              />
              <button onClick={nextSlide} className="navButton">
                &#10095;
              </button>
            </>
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
              {data?.name || "---"}
            </Typography>
          )}

          <Typography className="markerLocation">
            <Image src="/map/location-blue.svg" alt="" width={10} height={10} />
            {singleMarkerLoading ? (
              <Skeleton width="60%" />
            ) : (
              <span>{data?.location || "---"}</span>
            )}
          </Typography>
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Host Organization</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography className="value">
              {data?.host_organization || "---"}
            </Typography>
          )}
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Position</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography className="value">{data?.position || "--"}</Typography>
          )}
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">Postcode</Typography>
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography className="value">
              {data?.post_code || "---"}{" "}
            </Typography>
          )}
        </div>
        <div className="headerDetails">
          {singleMarkerLoading ? (
            <Skeleton width="60%" />
          ) : (
            <Typography className="footerText">
              <Image src="/map/email.svg" alt="" width={12} height={12} />
              <span>{data?.email || "---"} </span>
            </Typography>
          )}
          {singleMarkerLoading ? (
            <Skeleton width="30%" />
          ) : (
            <Typography className="footerText">
              <Image src="/map/cell-icon.svg" alt="" width={12} height={12} />
              <span>{data?.phone || "---"} </span>
            </Typography>
          )}
        </div>
        <div className="btnGrp">
          <Button
            className="navigateBtn"
            variant="contained"
            endIcon={
              <Image src="/map/navigate.svg" alt="" width={15} height={15} />
            }
            onClick={() => {
              const markerEntry = markersRef.current.find(
                (entry: any) => entry.id === data?.id
              );
              if (markerEntry) {
                const { marker } = markerEntry;
                handleMarkerClick(data, marker);
              } else {
                console.error(`Marker with ID ${id} not found.`);
              }
            }}
          >
            {data ? "Navigate" : <Skeleton width="100%" />}
          </Button>
          <IconButton
            className="iconBtn"
            onClick={() => {
              setShareDialogOpen(true);
            }}
          >
            {data ? (
              <Image src="/map/share-white.svg" alt="" width={13} height={13} />
            ) : (
              <Skeleton variant="circular" width={13} height={13} />
            )}
          </IconButton>
        </div>
      </Box>
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
        mapDetails={data}
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
