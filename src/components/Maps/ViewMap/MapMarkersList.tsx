import AutoCompleteSearch from "@/components/Core/AutoCompleteSearch";
import {
  Button,
  capitalize,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MapMarkersListDialog from "./MapMarkersLIstDialog";
import { navigateToMarker } from "@/lib/helpers/mapsHelpers";

const MapMarkersList = ({
  singleMarkers,
  setSearchString,
  searchString,
  setSingleMarkerOpen,
  setMarkerOption,
  markerOption,
  map,
  maps,
  markersRef,
  handleMarkerClick,
  getSingleMapMarkers,
  markersImagesWithOrganizationType,
  mapDetails,
  selectedOrginazation,
  setSelectedOrginazation,
  getData,
  searchParams,
  drawingManagerRef,
}: any) => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [mount, setMount] = useState<boolean>(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getOrginazationTypes = () => {
    let orginisationTypesOptions: any = Object.keys(
      markersImagesWithOrganizationType
    ).map((key: any) => ({
      title: key,
      label: capitalize(key) || key,
      img: markersImagesWithOrganizationType[key],
    }));

    return orginisationTypesOptions;
  };

  const handleSearchChange = (event: any) => {
    const newSearchString = event.target.value;
    setSearchString(newSearchString);
  };

  const handleSelectTypeChange = (newValue: any) => {
    if (newValue) {
      setSelectedOrginazation(newValue);
      getData({
        ...searchParams,
        type: newValue?.title,
      });
    } else {
      setSelectedOrginazation(null);
      getData({
        ...searchParams,
        type: "",
      });
    }
  };

  useEffect(() => {
    if (mount) {
      let debounce = setTimeout(() => {
        getData({
          search_string: encodeURIComponent(searchString),
          page: 1,
        });
      }, 500);
      return () => clearInterval(debounce);
    } else {
      setMount(true);
      setSearchString((searchParams?.search_string as string) || "");
    }
  }, [searchString]);

  useEffect(() => {
    if (searchParams?.organisation_type) {
      const selectType = getOrginazationTypes()?.find(
        (item: any) => item?.title == searchParams?.organisation_type
      );
      setSelectedOrginazation(selectType);
    }
    if (searchParams?.search_string) {
      setSearchString(searchParams?.search_string);
    }
  }, [searchParams, markersImagesWithOrganizationType]);

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
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Image src="/search-icon.svg" alt="" width={15} height={15} />
              </InputAdornment>
            ),
          }}
        />
        <AutoCompleteSearch
          data={getOrginazationTypes() || []}
          setSelectValue={setSelectedOrginazation}
          selectedValue={selectedOrginazation}
          placeholder="Select Type"
          onChange={handleSelectTypeChange}
        />
        {/* <AutoCompleteSearch
          data={markerFilterOptions}
          setSelectValue={setMarkerOption}
          selectedValue={markerOption}
          placeholder="Sort Filter"
        /> */}
      </div>
      {singleMarkers?.length > 0 ? (
        <div>
          <div className="listContainer">
            {singleMarkers
              ?.slice(0, 10)
              ?.map((markerDetails: any, index: any) => (
                <div
                  className="eachListItem"
                  key={index}
                  onClick={() => {
                    const markerEntry = markersRef.current.find(
                      (entry: any) => entry.id === markerDetails?.id
                    );
                    if (markerEntry) {
                      const { marker } = markerEntry;
                      navigateToMarker(
                        map,
                        searchParams?.marker_id,
                        singleMarkers
                      );
                      handleMarkerClick(markerDetails, marker);
                    } else {
                      console.error(`Marker with ID ${id} not found.`);
                    }
                    if (drawingManagerRef.current) {
                      drawingManagerRef.current.setDrawingMode(null);
                    }
                    setSingleMarkerOpen(true);
                  }}
                >
                  <div className="markerHeader">
                    <div className="location">
                      <img
                        alt="avtar"
                        src={
                          markerDetails?.images?.length > 0
                            ? markerDetails?.images?.[0]
                            : "/no-images.jpg"
                        }
                        width={20}
                        height={20}
                      />
                      <span>{markerDetails?.title || "---"}</span>
                    </div>
                    <div className="locationType">
                      <Image
                        src={"/map/location-blue.svg"}
                        width={12}
                        height={12}
                        alt="type"
                      />
                      <span>{markerDetails?.town?.split(" ")[0] || "---"}</span>
                    </div>
                  </div>

                  <div className="markerFooter">
                    <div className="latLang">
                      <Image
                        src="/map/email.svg"
                        alt=""
                        width={10}
                        height={10}
                      />
                      {markerDetails?.email || "---"}
                    </div>
                  </div>
                  <div className="markerFooter">
                    <div className="createdDate">
                      <span
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          textTransform: "capitalize",
                        }}
                      >
                        <img
                          width={15}
                          height={15}
                          src={
                            markerDetails?.organisation_type
                              ? markersImagesWithOrganizationType[
                                  markerDetails?.organisation_type
                                ]
                              : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"
                          }
                          alt={markerDetails?.organisation_type}
                        />
                        {markerDetails?.organisation_type || "---"}
                      </span>
                    </div>
                    <div className="createdDate">
                      <Image
                        src="/map/cell-icon.svg"
                        height={13}
                        width={13}
                        alt=""
                      />
                      <span>{markerDetails?.phone || "---"}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div style={{ textAlign: "end", marginTop: "0.5rem" }}>
            <Button
              className="showAllBtn"
              variant="outlined"
              onClick={handleClickOpen}
            >
              Show All markers
            </Button>
          </div>
        </div>
      ) : (
        <div className="nodataGrp">
          <Image
            src={"/no-markers.svg"}
            width={180}
            height={180}
            alt="no data"
          />
          <Typography className="nodataTxt">
            No markers added yet. Start placing markers on your map.
          </Typography>
        </div>
      )}
      {open && (
        <MapMarkersListDialog
          open={open}
          handleClose={handleClose}
          markersRef={markersRef}
          handleMarkerClick={handleMarkerClick}
          getSingleMapMarkers={getSingleMapMarkers}
          mapDetails={mapDetails}
          map={map}
        />
      )}
    </div>
  );
};

export default MapMarkersList;
