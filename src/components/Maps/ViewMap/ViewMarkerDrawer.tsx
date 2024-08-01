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

const ViewMarkerDrawer = ({ data, setData, onClose }: any) => {
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
          }}        >
          Back
        </Button>

        <IconButton className="iconBtn" >
          <Image src="/map/menu-with-bg.svg" alt="" height={28} width={28} />
        </IconButton>
      </header>
      <Box className="viewContent">
        <div className="imgBlock">
          <Image className="mapImg" src="/map/marker-view.png" alt="" height={100}
            width={100} />
        </div>
        <div className="headerDetails">
          <Typography className="markerTitle">
            John Doe
          </Typography>
          <Typography className="markerLocation">
            <Image src="/map/location-blue.svg" alt="" width={10} height={10} />
            <span>
              Mudgee, New South Wales
            </span>
          </Typography>
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">
            Host Organization
          </Typography>
          <Typography className="value">
            Goulburn Mulwaree Landcare Landscapes & Southern Highlands Landcare Network
          </Typography>
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">
            Position
          </Typography>
          <Typography className="value">
            Local Landcare Coordinator - Young adult
          </Typography>
        </div>
        <div className="eachMarkerDetail">
          <Typography className="title">
            Postcode
          </Typography>
          <Typography className="value">
            2794          </Typography>
        </div>
        <div className="headerDetails">
          <Typography className="footerText">
            <Image src="/map/email.svg" alt="" width={10} height={10} />
            <span>
              centrallandslandcare@gmail.com            </span>
          </Typography>
          <Typography className="footerText">
            <Image src="/map/cell-icon.svg" alt="" width={10} height={10} />
            <span>
              0439 786 631            </span>
          </Typography>
        </div>
        {/* <Typography variant="h6" sx={{ mt: 2 }}>
          {data ? data?.title : <Skeleton width="60%" />}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <LocationOnIcon sx={{ fontSize: 14 }} />{" "}
          {data ? data.type : <Skeleton width="40%" />}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {data ? data?.description : <Skeleton width="100%" />}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <LocationOnIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography variant="body2">
            {data ? data?.coordinates?.join(", ") : <Skeleton width="80%" />}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography variant="body2">
            {data ? datePipe(data?.created_at) : <Skeleton width="50%" />}
          </Typography>
        </Box> */}
        <div className="btnGrp">
          <Button
            className="navigateBtn"
            variant="contained"
            endIcon={<Image src="/map/navigate.svg" alt="" width={15} height={15} />}
          >
            {data ? "Navigate" : <Skeleton width="100%" />}
          </Button>
          <IconButton className="iconBtn">
            {data ? (
             <Image src="/map/share-white.svg" alt="" width={20} height={20}/>
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
