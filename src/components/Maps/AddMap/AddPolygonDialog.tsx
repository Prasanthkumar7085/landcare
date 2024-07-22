import { Button, Dialog, Drawer, IconButton } from "@mui/material";
import styles from "./addPolygonDialog.module.css";
import Image from "next/image";
import { Clear } from "@mui/icons-material";
const AddPolygonDialog = ({
  addPolygonOpen,
  setAddPolygonOpen,
  handleAddPolygonButtonClick,
  closeDrawing,
  setDrawingOpen
}: any) => {
  return (
    <div>
      <Dialog
        open={Boolean(addPolygonOpen)}
        sx={{
          zIndex: "1300 !important",
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "350px",
            margin: "0 auto",
            borderRadius: "8px",

          },
        }}
      >
        <div className={styles.closeButtonBlock}>

          <IconButton
            sx={{ marginTop: "1rem", marginRight: "1rem" }}
            onClick={() => {
              setAddPolygonOpen(false);
              closeDrawing()
              setDrawingOpen(false)
            }}
          >
            <Clear />
          </IconButton>
        </div>
        <div className={styles.dialogDiv}>
          <div className={styles.contentDiv}>
            <Image
              src={"/Polygon _icon.svg"}
              width={80}
              height={80}
              alt="f"
            />
            <div className={styles.header}>
              Draw your field on map
              <p className={styles.subheading}>
                Simply use the polygon tool to outline<br /> your fields directly on
                the map.
              </p>
            </div>
          </div>
          <div
            className={styles.buttons}
            onClick={() => {
              handleAddPolygonButtonClick();
            }}
          >
            Draw Field
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default AddPolygonDialog;
