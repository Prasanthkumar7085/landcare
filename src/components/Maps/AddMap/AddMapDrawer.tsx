import {
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const AddMapDrawer = ({
  addDrawerOpen,
  setAddDrawerOpen,
  clearAllPoints,
}: any) => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const [mapName, setMapName] = useState<any>();
  const [description, setDescription] = useState<any>();

  return (
    <div>
      <Drawer
        open={addDrawerOpen}
        anchor={"right"}
        sx={{
          zIndex: "1300 !important",
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            borderRadius: "20px 20px 0 0 ",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem",
            borderBottom: "1px solid #dddddd",
          }}
        >
          <Typography variant="caption">{"Add map"}</Typography>
          <IconButton
            onClick={() => {
              setAddDrawerOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <hr></hr>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Map Name</label>
            <TextField
              placeholder="Enter Map Name"
              value={mapName}
              onChange={(e) => {
                setMapName(e.target.value);
              }}
            ></TextField>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Map Description</label>
            <TextField
              placeholder="Enter Map Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            ></TextField>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              sx={{ background: "white", color: "#769f3f" }}
              onClick={() => {
                setAddDrawerOpen(false);
                clearAllPoints();
              }}
            >
              Cancel
            </Button>

            <Button sx={{ background: "#769f3f", color: "white" }}>
              Save Map
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default AddMapDrawer;
