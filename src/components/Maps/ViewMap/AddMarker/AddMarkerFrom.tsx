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
          maxWidth: "350px",
          margin: "0 auto",
          borderRadius: "8px",
        },
      }}
    >
      <div>
        <h3>Marker Details</h3>
        <form>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Name:</label>
              <TextField
                placeholder="Enter Title"
                value={popupFormData.title}
                name="title"
                onChange={handleInputChange}
              />
              <ErrorMessagesComponent errorMessage={errorMessages["title"]} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Description: </label>

              <TextField
                name="description"
                placeholder="Enter Description"
                value={popupFormData.description}
                rows={4}
                onChange={handleInputChange}
              />
              <ErrorMessagesComponent
                errorMessage={errorMessages["description"]}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Marker Type: </label>
              <div style={{ width: "100%" }}>
                <AutoCompleteSearch
                  data={mapTypeOptions}
                  setSelectValue={setMarkerType}
                  selectedValue={markerType}
                  placeholder=""
                />
              </div>
              <ErrorMessagesComponent errorMessage={errorMessages["type"]} />
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <Button onClick={handleCancel} disabled={loading ? true : false}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
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
