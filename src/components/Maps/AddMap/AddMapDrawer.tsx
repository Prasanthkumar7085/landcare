import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { checkAllowedValidText } from "@/lib/helpers/inputCheckingFunctions";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import {
  addMapWithCordinatesAPI,
  updateMapWithCordinatesAPI,
} from "@/services/maps";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AddMapDrawer = ({
  mapDetails,
  setMapDetails,
  addMapDrawerOpen,
  setAddMapDrawerOpen,
  getSingleMapDetails,
}: any) => {
  const { id } = useParams();
  const pathName = usePathname();
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

  const addMapWithCordinates = async () => {
    setLoading(true);

    let body = {
      title: mapDetails?.title ? mapDetails?.title : "",
      description: mapDetails?.description ? mapDetails?.description : "",
      status: mapDetails?.status ? mapDetails?.status : "draft",
      geo_type: "polygon",
      geo_coordinates: polygonCoords.map((obj: any) => Object.values(obj)),
      geo_zoom: 14,
    };
    try {
      const response = await getmapDetailsAPI(body);
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        setAddMapDrawerOpen(false);
        dispatch(storeEditPolygonCoords([]));
        setErrorMessages([]);
        setMapDetails({});
        router.push(`/add-markers/${response?.data?.id || id}`);
      } else if (response?.status == 422) {
        setErrorMessages(response?.error_data);
      } else if (response?.status == 409) {
        setErrorMessages(response?.error_data);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Dialog className="addMapDrawer" open={addMapDrawerOpen}>
        <div className="dialogHedaer">
          <Typography className="dialogHeading">
            {id ? "Update map" : "Add map"}
          </Typography>
          <IconButton
            className="iconBtn"
            onClick={() => {
              setAddMapDrawerOpen(false);
              getSingleMapDetails({});
              setErrorMessages([]);
              setMapDetails({});
              if (pathName === "/add-map") {
                router.push("/maps");
              }
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
              rows={9}
              name="description"
              onChange={handleFieldValue}
            />
          </div>
          <div className="dialogActionBtn">
            <Button
              disabled={loading ? true : false}
              onClick={() => {
                setAddMapDrawerOpen(false);
                getSingleMapDetails({});
                setErrorMessages([]);
                setMapDetails({});
                if (pathName === "/add-map") {
                  router.push("/maps");
                }
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() => addMapWithCordinates()}
              disabled={loading ? true : false}
            >
              {loading ? (
                <CircularProgress color="inherit" size={"1rem"} />
              ) : id ? (
                "Update Map"
              ) : (
                "Save Map"
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default AddMapDrawer;
