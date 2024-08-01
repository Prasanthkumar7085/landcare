import {
  Button,
  CardActions,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import AutoCompleteSearch from "@/components/Core/AutoCompleteSearch";
import {
  mapTypeOptions,
  markerFilterOptions,
} from "@/lib/constants/mapConstants";
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
  markerData,
  setMarkerOption,
  markerOption,
  getData,
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
    <div className="markersList">
      <div className="filterGrp">
        <TextField
          className="defaultTextFeild"
          variant="outlined"
          size="small"
          type="search"
          placeholder="Search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Image src="/search-icon.svg" alt="" width={15} height={15} />
              </InputAdornment>
            ),
          }}
        />
        <AutoCompleteSearch
          data={markerFilterOptions}
          setSelectValue={setMarkerOption}
          selectedValue={markerOption}
          placeholder="Search Filter"
        />
      </div>
      <div className="listContainer">
        {singleMarkers?.map((marker: any, index: any) => (
          <div
            className="eachListItem"
            key={index}
            onClick={() => {
              setSingleMarkerOpen(true);
              getSingleMarker(marker?.id);
            }}
          >
            <div className="markerHeader">
              <div className="location">
                <Image alt="" src="/avatar@2x.png" width={20} height={20} />
                <span>{marker?.name}</span>
              </div>
              <div className="locationType">
                <Image
                  src={"/markers/marker-location-icon.svg"}
                  width={12}
                  height={12}
                  alt="type"
                />
                <span>{marker?.location}</span>
              </div>
            </div>
            <Typography className="markerDesc">{marker?.lls_region}</Typography>

            <Typography className="markerDesc">
              {marker?.host_organization}
            </Typography>

            <div className="markerFooter">
              <div className="latLang">
                <Image
                  src="/map/location-blue.svg"
                  alt=""
                  width={10}
                  height={10}
                />
                {marker?.email}
              </div>
              <div className="createdDate">
                <Image src="/map/clock.svg" height={13} width={13} alt="" />
                <span>{marker?.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "end" }}>
        <Button
          className="showAllBtn"
          variant="outlined"
          onClick={handleClickOpen}
        >
          Show All markers
        </Button>
      </div>

      <MapMarkersListDialog open={open} handleClose={handleClose} />
    </div>
  );
};

export default MapMarkersList;
