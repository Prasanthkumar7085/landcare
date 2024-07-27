import { Button, Menu, MenuItem, Typography } from "@mui/material";
import styles from "./view-map-block.module.css";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import MapMarkersList from "./MapMarkersList";
const ViewMapDetailsDrawer = ({
  mapDetails,
  markers,
  paginationDetails,
  getData,
  setSearch,
  search,
  singleMarkers,
  setSearchString,
  searchString,
}: any) => {
  const router = useRouter();
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <Button onClick={() => router.push("/maps")}>Back</Button>
          <div>
            <Button variant="contained">Import</Button>
            <Button onClick={handleClick}>...</Button>
          </div>
        </div>
        <h2 className={styles.heading}>Map Details</h2>

        <div className={styles.actionsbar}></div>
      </header>
      <div id={styles.listview} className="scrollbar">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption">
            {mapDetails?.title ? mapDetails?.title : "--"}
          </Typography>
          <Typography variant="caption">
            {dayjs(mapDetails?.created_at).format("MM-DD-YYYY")}
          </Typography>
          <Typography variant="caption">
            {mapDetails?.description ? mapDetails?.description : "--"}
          </Typography>
        </div>
        <div>
          <Typography variant="h6" className={styles.title}>
            Markers
          </Typography>
        </div>
        {markers?.length > 0 || singleMarkers?.length > 0 ? (
          <div>
            <MapMarkersList
              markers={markers}
              paginationDetails={paginationDetails}
              getData={getData}
              setSearch={setSearch}
              search={search}
              singleMarkers={singleMarkers}
              setSearchString={setSearchString}
              searchString={searchString}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Image
              src={"/no-markers.svg"}
              width={120}
              height={120}
              alt="no data"
            />
            <Typography variant="caption">
              No markers added yet.{""}
              Start placing markers on your map.
            </Typography>
          </div>
        )}
      </div>
      <div className={styles.buttoncontainer}></div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => router.push(`/update-map/${id}`)}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </div>
  );
};
export default ViewMapDetailsDrawer;
