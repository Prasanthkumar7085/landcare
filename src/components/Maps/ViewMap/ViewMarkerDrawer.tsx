import { datePipe } from "@/lib/helpers/datePipe";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Image from "next/image";
// import styles from "./view-map-block.module.css";

const ViewMarkerDrawer = ({
  data,
  setData,
  onClose,
  singleMarkerLoading,
}: any) => {
  return (
    <div className="signleMarkerView">
      <header className="header">
        <Button
          className="backBtn"
          startIcon={
            <Image src="/map/map-backBtn.svg" alt="" height={15} width={15} />
          }
          onClick={() => {
            onClose(false);
            setData({});
          }}
        >
          Back
        </Button>

        <IconButton className="iconBtn">
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
    </div>
  );
};

export default ViewMarkerDrawer;
