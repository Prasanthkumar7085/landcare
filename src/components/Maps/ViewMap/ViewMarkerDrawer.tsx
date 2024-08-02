import DeleteDialog from "@/components/Core/DeleteDialog";
import { datePipe } from "@/lib/helpers/datePipe";
import { deleteMarkerAPI, getSingleMarkerAPI } from "@/services/maps";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareIcon from "@mui/icons-material/Share";
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

const ViewMarkerDrawer = ({
  onClose,
  getSingleMapMarkers,
  currentBouncingMarkerRef,
  setShowMarkerPopup,
  data,
  setData,
  currentBouncingMarker,
  markersRef,
}: any) => {
  const { id } = useParams();
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleMarkerLoading, setSingleMarkerLoading] = useState(false);

  const getSingleMarker = async (marker_id: any) => {
    setSingleMarkerLoading(true);
    let markerID = marker_id;
    try {
      const response = await getSingleMarkerAPI(id, markerID);
      setData(response?.data);
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
  }, [params]);
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
            markersRef.current.forEach((marker: any) => {
              if (marker.getAnimation() === google.maps.Animation.BOUNCE) {
                marker.setAnimation(null);
              }
            });
          }}
        >
          Back
        </Button>

        <IconButton className="iconBtn" onClick={handleClick}>
          <Image src="/map/menu-with-bg.svg" alt="" height={28} width={28} />
        </IconButton>
      </header>
      <Box className="viewContent">
        <div className="imgBlock">
          <Image
            className="mapImg"
            src="/map/marker-view.png"
            alt=""
            height={100}
            width={100}
          />
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
          >
            {data ? "Navigate" : <Skeleton width="100%" />}
          </Button>
          <IconButton className="iconBtn">
            {data ? (
              <Image src="/map/share-white.svg" alt="" width={13} height={13} />
            ) : (
              <Skeleton variant="circular" width={40} height={40} />
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
