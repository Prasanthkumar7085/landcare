import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  addMapWithCordinatesAPI,
  updateMapWithCordinatesAPI,
} from "@/services/maps";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { handleGeneratePolygonBase64 } from "@/lib/helpers/mapsHelpers";

const AddMapDrawer = ({
  mapDetails,
  setMapDetails,
  addDrawerOpen,
  setAddDrawerOpen,
  clearAllPoints,
  closeDrawing,
  map,
  mapRef,
}: any) => {
  const { id } = useParams();

  const polygonCoords = useSelector((state: any) => state.maps.polygonCoords);
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFieldValue = (event: any) => {
    const { name, value } = event.target;
    const deviceVAlue = value.replace(/\s+/g, " ");
    setMapDetails({
      ...mapDetails,
      [name]: deviceVAlue,
    });
  };

  const getmapDetailsAPI = (body: any) => {
    let responseData: any;

    if (id) {
      responseData = updateMapWithCordinatesAPI(body, id);
    } else {
      responseData = addMapWithCordinatesAPI(body);
    }
    return responseData;
  };

  const addMapWithCordinates = async () => {
    let mapImage;
    await handleGeneratePolygonBase64(map, mapRef, polygonCoords)
      .then((base64Url) => {
        mapImage = base64Url;
      })
      .catch((error) => {
        console.error(error);
      });

    setLoading(true);
    let body = {
      title: mapDetails?.title ? mapDetails?.title : "",
      description: mapDetails?.description ? mapDetails?.description : "",
      status: "draft",
      geo_type: "polygon",
      geo_coordinates: polygonCoords.map((obj: any) => Object.values(obj)),
      geo_zoom: 14,
      image: mapImage,
    };
    try {
      const response = await getmapDetailsAPI(body);
      console.log(response, "sdaksai9");
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        dispatch(storeEditPolygonCoords([]));
        router.push(`/add-markers/${response?.data?.id || id}`);
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
              value={mapDetails?.title}
              name="title"
              onChange={handleFieldValue}
            ></TextField>
            <ErrorMessagesComponent errorMessage={errorMessages["title"]} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Map Description</label>
            <TextField
              multiline
              placeholder="Enter Map Description"
              value={mapDetails?.description}
              rows={7}
              name="description"
              onChange={handleFieldValue}
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
              disabled={loading ? true : false}
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
              {loading ? (
                <CircularProgress
                  color="inherit"
                  sx={{ width: "10px", height: "10px" }}
                />
              ) : (
                "Save Map"
              )}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default AddMapDrawer;
