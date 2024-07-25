import {
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { addMapWithCordinatesAPI } from "@/services/maps";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";

const AddMapDrawer = ({
  addDrawerOpen,
  setAddDrawerOpen,
  clearAllPoints,
  closeDrawing,
}: any) => {
  const polygonCoords = useSelector((state: any) => state.maps.polygonCoords);
  const router = useRouter();
  const dispatch = useDispatch();

  const [mapName, setMapName] = useState<any>();
  const [description, setDescription] = useState<any>();
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const addMapWithCordinates = async () => {
    setLoading(true);
    let body = {
      title: mapName ? mapName : "",
      description: description ? description : "",
      status: "active",
      geo_type: "polygon",
      geo_coordinates: polygonCoords.map((obj: any) => Object.values(obj)),
      geo_zoom: 14,
    };
    try {
      const response = await addMapWithCordinatesAPI(body);
      if (response?.status == 200 || response?.status == 201) {
        toast.success("Map added succesfully");
        dispatch(storeEditPolygonCoords([]));
        router.push(`/add-markers/${response?.data?.id}`);
      } else if (response?.status == 422) {
        setErrorMessages(response?.error_data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
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
              dispatch(storeEditPolygonCoords([]));
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
            <ErrorMessagesComponent errorMessage={errorMessages["title"]} />
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
                closeDrawing();
              }}
            >
              Cancel
            </Button>

            <Button
              sx={{ background: "#769f3f", color: "white" }}
              onClick={() => addMapWithCordinates()}
            >
              Save Map
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default AddMapDrawer;
