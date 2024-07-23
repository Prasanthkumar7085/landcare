import { Button, Typography } from "@mui/material";
import styles from "./view-map-block.module.css";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import MapMarkersList from "./MapMarkersList";
const ViewMapDetailsDrawer = ({ mapDetails, markers, paginationDetails, getData, setSearch, search, singleMarkers }: any) => {
  const router = useRouter();
  return (
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <h2 className={styles.heading}>Map Details</h2>
        </div>
        <Button onClick={() => router.back()}>Back</Button>
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
          <MapMarkersList
            markers={markers}
            paginationDetails={paginationDetails}
            getData={getData}
            setSearch={setSearch}
            search={search}
            singleMarkers={singleMarkers}
          />
        </div>
      </div>
      <div className={styles.buttoncontainer}></div>
    </div>
  );
};
export default ViewMapDetailsDrawer;
