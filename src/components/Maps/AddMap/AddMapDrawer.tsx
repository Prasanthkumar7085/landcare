import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { checkAllowedValidText } from "@/lib/helpers/inputCheckingFunctions";
import { storeEditPolygonCoords } from "@/redux/Modules/mapsPolygons";
import {
  addMapWithCordinatesAPI,
  getSingleMapDetailsAPI,
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
import { useEffect, useState } from "react";
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
  const [mapData, setMapData] = useState<any>({});
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFieldValue = (event: any) => {
    const { name, value } = event.target;
    if (value && checkAllowedValidText(value)) {
      let details = { ...mapData };
      details[name] = value;
      setMapData(details);
    } else {
      let details = { ...mapData };
      delete details[name];
      setMapData(details);
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
      title: mapData?.title ? mapData?.title : "",
      description: mapData?.description ? mapData?.description : "",
      status: mapData?.status ? mapData?.status : "draft",
      geo_type: "polygon",
      geo_coordinates: polygonCoords.map((obj: any) => Object.values(obj)),
      geo_zoom: 14,
    };
    try {
      const response = await getmapDetailsAPI(body);
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        getSingleMapDetails({ id: response?.data?.id });
        setAddMapDrawerOpen(false);
        setErrorMessages([]);
        setMapData({});
        router.replace(`/view-map/${response?.data?.id || id}`);
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

  const getSingleMapData = async () => {
    setLoading(true);
    try {
      const response = await getSingleMapDetailsAPI(id);
      if (response?.status == 200 || response?.status == 201) {
        setMapData(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleMapData();
    }
  }, [addMapDrawerOpen]);

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
              setMapData({});
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
            <label className="label">
              Map Title<span style={{ color: "red" }}>*</span>
            </label>
            <TextField
              className="defaultTextFeild text"
              placeholder="Enter Map Title"
              value={mapData?.title ? mapData?.title : ""}
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
              value={mapData?.description}
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
                setMapData({});
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
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default AddMapDrawer;
