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

  const [popupFormData, setPopupFormData] = useState<any>({});
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [markerType, setMarkerType] = useState<any>(null);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const markerValue = value.replace(/^\s+/, '');
    setPopupFormData({ ...popupFormData, [name]: markerValue });
  };

  const handleCancel = () => {
    removalMarker(0);
    setPopupFormData({});
    setMarkerType(null);
    setErrorMessages([]);
    setShowMarkerPopup(false);
  };

  const handleSave = async () => {
    setLoading(true);
    let body = {
      ...popupFormData,
      ...placeDetails,
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
        <form>
          <div className="eachFeildGrp">
            <label>Name</label>
            <TextField
              className="defaultTextFeild text"
              placeholder="Enter Name"
              value={popupFormData.name}
              name="name"
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent errorMessage={errorMessages["name"]} />
          </div>
          <div className="eachFeildGrp">
            <label>Position</label>
            <TextField
              className="defaultTextFeild multiline"
              name="position"
              placeholder="Enter Position"
              value={popupFormData.position}
              rows={3}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["position"]}
            />
          </div>
          <div className="eachFeildGrp">
            <label>Host Organization</label>
            <TextField
              className="defaultTextFeild multiline"
              name="host_organization"
              placeholder="Enter Host Organization"
              value={popupFormData.host_organization}
              rows={3}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["host_organization"]}
            />
          </div>
          <div className="eachFeildGrp">
            <label>LLS Region</label>
            <TextField
              className="defaultTextFeild multiline"
              name="lls_region"
              placeholder="Enter LLS Region"
              value={popupFormData.lls_region}
              rows={3}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["lls_region"]}
            />
          </div>
          <div className="eachFeildGrp">
            <label>Phone</label>
            <TextField
              className="defaultTextFeild multiline"
              name="phone"
              placeholder="Enter Phone"
              value={popupFormData.phone}
              rows={3}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["phone"]}
            />
          </div>
          <div className="eachFeildGrp">
            <label>Email</label>
            <TextField
              className="defaultTextFeild multiline"
              name="email"
              placeholder="Enter Email"
              value={popupFormData.email}
              rows={3}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["email"]}
            />
          </div>
          <div className="eachFeildGrp">
            <label>Location</label>
            <TextField
              className="defaultTextFeild multiline"
              name="location"
              placeholder="Enter Location"
              value={popupFormData.location}
              rows={3}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["location"]}
            />
          </div>
          <div className="eachFeildGrp">
            <label>Postcode</label>
            <TextField
              className="defaultTextFeild multiline"
              name="post_code"
              placeholder="Enter Postcode"
              value={popupFormData.post_code}
              rows={3}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["post_code"]}
            />
          </div>
          {/* <div className="eachFeildGrp">
            <label>Marker Type</label>
            <AutoCompleteSearch
              data={mapTypeOptions}
              setSelectValue={setMarkerType}
              selectedValue={markerType}
              placeholder="Select Marker Type"
            />
            <ErrorMessagesComponent errorMessage={errorMessages["type"]} />
          </div> */}

          <div className="actionBtnGrp">
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
