import { useState } from "react";
import styles from "./add-marker.module.css";
import {
  Autocomplete,
  Box,
  Dialog,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { mapTypeOptions } from "@/lib/constants/mapConstants";
import { addMarkerDeatilsAPI } from "@/services/maps";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import Image from "next/image";

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
        setShowMarkerPopup(false);
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
                <Autocomplete
                  className="defaultAutoComplete"
                  value={markerType ? markerType : null}
                  disablePortal
                  options={mapTypeOptions?.length ? mapTypeOptions : []}
                  PaperComponent={({ children }: any) => (
                    <Paper
                      style={{
                        fontSize: "12px",
                        fontFamily: "'Poppins', Sans-serif",
                        fontWeight: "500",
                      }}
                    >
                      {children}
                    </Paper>
                  )}
                  getOptionLabel={(option: any) =>
                    typeof option === "string" ? option : option?.["title"]
                  }
                  renderOption={(props: any, option: any) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={option.label}
                        component="li"
                        sx={{
                          "& > img": { mr: 2, flexShrink: 0 },
                        }}
                        {...optionProps}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "0.6rem",
                          }}
                        >
                          <Image
                            src={option?.img}
                            width={12}
                            height={12}
                            alt="type"
                          />

                          {option.label}
                        </div>
                      </Box>
                    );
                  }}
                  onChange={(_: any, newValue: any) => {
                    setMarkerType(newValue);
                  }}
                  sx={{
                    "& .MuiFormControl-root": {
                      width: "170px",
                      background: "#fff",
                    },
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      placeholder={"Select Marker Type"}
                      size="small"
                    />
                  )}
                />
              </div>
              <ErrorMessagesComponent errorMessage={errorMessages["type"]} />
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
