import AutoCompleteSearch from "@/components/Core/AutoCompleteSearch";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { mapTypeOptions } from "@/lib/constants/mapConstants";
import { addMarkerDeatilsAPI } from "@/services/maps";
import { Button, CircularProgress, Dialog, TextField } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./add-marker.module.css";

const MarkerPopup = ({
  setShowMarkerPopup,
  showMarkerPopup,
  placeDetails,
  getSingleMapMarkers,
  removalMarker,
}: any) => {
  const { id } = useParams();

  const [popupFormData, setPopupFormData] = useState({
    title: "",
    description: "",
  });
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [markerType, setMarkerType] = useState<any>(null);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPopupFormData({ ...popupFormData, [name]: value });
  };

  const handleCancel = () => {
    removalMarker(0);
    setPopupFormData({
      title: "",
      description: "",
    });
    setMarkerType(null);
    setErrorMessages([]);
    setShowMarkerPopup(false);
  };

  const handleSave = async () => {
    setLoading(true);
    let body = {
      ...popupFormData,
      ...placeDetails,
      type: markerType?.title,
    };
    try {
      const response = await addMarkerDeatilsAPI(id, body);
      if (response?.status == 200 || response?.status == 201) {
        toast.success("Marker added successfully");
        handleCancel();
        await getSingleMapMarkers({});
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
    <Dialog
      open={showMarkerPopup}
      sx={{
        zIndex: "1300 !important",
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "300px",
          margin: "0 auto",
          borderRadius: "8px",
        },
      }}
    >
      <div className="addMarkerDialog">
        <h3 className="dialogHeading">Add Marker</h3>
        <form >
            <div className="eachFeildGrp" >
              <label >Marker Name</label>
            <TextField
              className="defaultTextFeild text"
                placeholder="Enter Title"
                value={popupFormData.title}
                name="title"
                onChange={handleInputChange}
              />
              <ErrorMessagesComponent errorMessage={errorMessages["title"]} />
            </div>
          <div className="eachFeildGrp" >
              <label>Description</label>
            <TextField
              className="defaultTextFeild multiline"
                name="description"
                placeholder="Enter Description"
                value={popupFormData.description}
                rows={3}
                onChange={handleInputChange}
              />
              <ErrorMessagesComponent
                errorMessage={errorMessages["description"]}
              />
            </div>
          <div className="eachFeildGrp" >
              <label>Marker Type</label>
                <AutoCompleteSearch
                  data={mapTypeOptions}
                  setSelectValue={setMarkerType}
                  selectedValue={markerType}
                  placeholder="Select Marker Type"
                />
              <ErrorMessagesComponent errorMessage={errorMessages["type"]} />
            </div>
       
          <div className="actionBtnGrp">
            <Button  onClick={handleCancel} disabled={loading ? true : false}>
              Cancel
            </Button>
            <Button  onClick={handleSave}>
              {loading ? (
                <CircularProgress
                  color="inherit"
                  sx={{ width: "10px", height: "10px" }}
                />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
export default MarkerPopup;
