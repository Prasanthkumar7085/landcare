import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "./index.module.css";
import { datePipe } from "@/lib/helpers/datePipe";

const MapMarkersList = ({ markers }: any) => {
  return (
    <div className={styles.markergroup}>
      <div className={styles.markersection}>
        <div className={styles.mapdetails}>
          <div className={styles.markertop}>
            <Typography variant="h6" className={styles.title}>
              Markers
            </Typography>
            <div className={styles.inputsearch}>
              <TextField
                variant="outlined"
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className={styles.searchicon} />
                    </InputAdornment>
                  ),
                }}
              />
              <div className={styles.inputfilter}>
                <img
                  className={styles.filtericon}
                  alt=""
                  src="/filtericon.svg"
                />
                <p className={styles.filter}>Filter</p>
              </div>
              <IconButton className={styles.more1}>
                <MoreVertIcon className={styles.dotsThreeOutlineIcon} />
              </IconButton>
            </div>
          </div>
          {markers.map((marker: any, index: any) => (
            <Card className={styles.markerlocation} key={index}>
              <CardContent className={styles.locationcard}>
                <div className={styles.locationprofile}>
                  <div className={styles.locationname}>
                    <img
                      className={styles.avatarIcon}
                      alt=""
                      src="/avatar@2x.png"
                    />
                    <Typography
                      variant="subtitle1"
                      className={styles.locationtitle}
                    >
                      {marker.title}
                    </Typography>
                  </div>
                  <div className={styles.markerlocation1}>
                    <LocationOnIcon className={styles.clock1Icon} />
                    <Typography className={styles.filter}>
                      {marker.type}
                    </Typography>
                  </div>
                </div>
                <Typography className={styles.paragraph1}>
                  {marker.description}
                </Typography>
                <div className={styles.longitudegroup}>
                  <div className={styles.longitudediv}>
                    <LocationOnIcon className={styles.clock1Icon} />
                    <Typography className={styles.filter}>
                      {marker.coordinates?.join(", ")}
                    </Typography>
                  </div>
                  <div className={styles.datetime1}>
                    <AccessTimeIcon className={styles.timeicon} />
                    <Typography className={styles.filter}>
                      {datePipe(marker.created_at)}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className={styles.allmarkersgroup}>
        <CardActions className={styles.inputbutton}>
          <Typography variant="button" className={styles.showAllMarkers}>
            Show All markers
          </Typography>
        </CardActions>
      </div>
    </div>
  );
};

export default MapMarkersList;
