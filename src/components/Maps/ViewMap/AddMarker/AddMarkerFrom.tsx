import { useState } from "react";
import styles from "./add-marker.module.css";
import { Dialog, MenuItem, Select } from "@mui/material";
import { mapTypeOptions } from "@/lib/constants/mapConstants";
import { addMarkerDeatilsAPI } from "@/services/maps";
import { useParams } from "next/navigation";
const MarkerPopup = ({
  setShowMarkerPopup,
  showMarkerPopup,
  popupMarker,
  placeDetails,
}: any) => {
  const { id } = useParams();
  console.log(showMarkerPopup, "9239932932");
  const [popupFormData, setPopupFormData] = useState({
    title: "",
    description: "",
    type: "",
  });
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPopupFormData({ ...popupFormData, [name]: value });
  };

  const handleCancel = () => {
    setPopupFormData({
      title: "",
      description: "",
      type: "",
    });
    setShowMarkerPopup(false);
    if (popupMarker) {
      popupMarker.setMap(null);
    }
  };

  const handleSave = async () => {
    console.log("Saved:", popupFormData);
    let body = {
      ...popupFormData,
      ...placeDetails,
    };
    try {
      const response = await addMarkerDeatilsAPI(id, body);
    } catch (err) {
    } finally {
    }
    setShowMarkerPopup(false);
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
              <input
                type="text"
                name="title"
                value={popupFormData.title}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Description: </label>

              <input
                name="description"
                value={popupFormData.description}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Marker Type: </label>

              <Select
                className="settingSelectFeild"
                onChange={handleInputChange}
                name={"type"}
                value={popupFormData?.type}
              >
                {mapTypeOptions?.map((option: any) => (
                  <MenuItem
                    className="menuItem"
                    key={option}
                    value={option?.title}
                  >
                    {option?.title}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
export default MarkerPopup;
