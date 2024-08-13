import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { checkAllowedValidText } from "@/lib/helpers/inputCheckingFunctions";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import {
  addMapWithCordinatesAPI,
  getStaticMapAPI,
  updateMapWithCordinatesAPI,
} from "@/services/maps";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AddMapDrawer = ({
  mapDetails,
  setMapDetails,
  addDrawerOpen,
  setAddDrawerOpen,
  clearAllPoints,
  closeDrawing,
  map,
  mapRef,
  getSingleMapDetails,
}: any) => {
  const { id } = useParams();

  const polygonCoords = useSelector((state: any) => state.maps.polygonCoords);
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFieldValue = (event: any) => {
    const { name, value } = event.target;
    if (value && checkAllowedValidText(value)) {
      let details = { ...mapDetails };
      details[name] = value;
      setMapDetails(details);
    } else {
      let details = { ...mapDetails };
      delete details[name];
      setMapDetails(details);
    }
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

  const getStaticMap = async () => {
    let body = {
      coordinates: [...polygonCoords, polygonCoords[0]],
      markers: [],
    };
    try {
      const response = await getStaticMapAPI(body);
      if (response?.status == 200 || response?.status == 201) {
        return response?.data;
      } else {
        toast.error(response?.error_data.coordinates);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addMapWithCordinates = async () => {
    setLoading(true);
    // let mapImage;
    // mapImage = await getStaticMap();

    let body = {
      title: mapDetails?.title ? mapDetails?.title : "",
      description: mapDetails?.description ? mapDetails?.description : "",
      status: mapDetails?.status ? mapDetails?.status : "draft",
      geo_type: "polygon",
      geo_coordinates: polygonCoords.map((obj: any) => Object.values(obj)),
      geo_zoom: 14,
    };
    try {
      // if (!mapImage) {
      //   toast.warning("Error while getting map image!");
      // } else {
      const response = await getmapDetailsAPI(body);
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        dispatch(storeEditPolygonCoords([]));
        setErrorMessages([]);
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
      <Drawer className="addMapDrawer" open={addDrawerOpen} anchor={"right"}>
        <div className="dialogHedaer">
          <Typography className="dialogHeading">
            {id ? "Update map" : "Add map"}
          </Typography>
          <IconButton
            className="iconBtn"
            onClick={() => {
              setAddDrawerOpen(false);
              getSingleMapDetails();
              setErrorMessages([]);
            }}
          >
            <CloseIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </div>

        <div className="dialogBody">
          <div className="eachFeildGrp">
            <label className="label">Map Name</label>
            <TextField
              className="defaultTextFeild text"
              placeholder="Enter Map Name"
              value={mapDetails?.title}
              name="title"
              onChange={handleFieldValue}
            />
            <ErrorMessagesComponent errorMessage={errorMessages["title"]} />
          </div>
          <div className="eachFeildGrp">
            <label className="label">Map Description</label>
            <TextField
              className="defaultTextFeild multiline"
              multiline
              placeholder="Enter Map Description"
              value={mapDetails?.description}
              rows={4}
              name="description"
              onChange={handleFieldValue}
            />
          </div>
          <div className="dialogActionBtn">
            <Button
              disabled={loading ? true : false}
              onClick={() => {
                setAddDrawerOpen(false);
                getSingleMapDetails();
                setErrorMessages([]);
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => addMapWithCordinates()}
              disabled={loading ? true : false}
            >
              {loading ? (
                <CircularProgress
                  color="inherit"
                  sx={{ width: "10px", height: "10px" }}
                />
              ) : id ? (
                "Update Map"
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
