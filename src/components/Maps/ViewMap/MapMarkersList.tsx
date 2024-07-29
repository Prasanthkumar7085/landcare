import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import {
  CardActions,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { mapTypeOptions } from "@/lib/constants/mapConstants";
import { datePipe } from "@/lib/helpers/datePipe";
import { getSingleMarkerAPI } from "@/services/maps";
import styles from "./index.module.css";
import MapMarkersListDialog from "./MapMarkersLIstDialog";

const MapMarkersList = ({
  singleMarkers,
  setSearchString,
  searchString,
  setSingleMarkerOpen,
  singleMarkeropen,
  setMarkerData,
  markerData
}: any) => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);

  const getSingleMarker = async (marker_id: any) => {
    try {
      const response = await getSingleMarkerAPI(id, marker_id);
      setMarkerData(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
                size="small"
                type="search"
                placeholder="Search"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
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
          {singleMarkers?.map((marker: any, index: any) => (
            <div
              className={styles.markerlocation}
              key={index}
              onClick={() => {
                setSingleMarkerOpen(true);
                getSingleMarker(marker?.id);
              }}
            >
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
                    <Image
                      src={
                        mapTypeOptions?.find(
                          (item: any) => item?.title == marker.type
                        )?.img as string
                      }
                      width={12}
                      height={12}
                      alt="type"
                    />
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
                      {marker.coordinates.join(", ")}
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
            </div>
          ))}
        </div>
      </div>
      <div className={styles.allmarkersgroup} onClick={handleClickOpen}>
        <CardActions className={styles.inputbutton}>
          <Typography variant="button" className={styles.showAllMarkers}>
            Show All markers
          </Typography>
        </CardActions>
      </div>
      <MapMarkersListDialog open={open} handleClose={handleClose} />
    </div>
  );
};

export default MapMarkersList;
