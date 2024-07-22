import { Typography } from "@mui/material";
import styles from "./view-map-block.module.css";
import dayjs from "dayjs";
const ViewMapDetailsDrawer = ({ mapDetails }: any) => {
  return (
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <h2 className={styles.heading}>Map Details</h2>
        </div>

        <div className={styles.actionsbar}></div>
      </header>
      <div id={styles.listview} className="scrollbar">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption">{mapDetails?.title}</Typography>
          <Typography variant="caption">
            {dayjs(mapDetails?.created_at).format("MM-DD-YYYY")}
          </Typography>
          <Typography variant="caption">{mapDetails?.description}</Typography>
        </div>
        <div>
          <Typography variant="h6">Markers</Typography>
        </div>
      </div>
      <div className={styles.buttoncontainer}></div>
    </div>
  );
};
export default ViewMapDetailsDrawer;
