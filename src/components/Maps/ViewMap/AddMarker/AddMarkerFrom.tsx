import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { addMarkerDeatilsAPI, updateMarkerDeatilsAPI } from "@/services/maps";
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";

const MarkerPopup = ({
  setShowMarkerPopup,
  showMarkerPopup,
  placeDetails,
  getSingleMapMarkers,
  removalMarker,
  popupFormData,
  setPopupFormData,
  setSingleMarkerData,
}: any) => {
  const { id } = useParams();
  const params = useSearchParams();
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [markerType, setMarkerType] = useState<any>(null);
  const [imageInput, setImageInput] = useState<any>("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const markerValue = value.replace(/^\s+/, "");
    setPopupFormData({ ...popupFormData, [name]: markerValue });
  };

  const handleCancel = () => {
    removalMarker(0);
    setMarkerType(null);
    setErrorMessages([]);
    setShowMarkerPopup(false);
    setPopupFormData({});
  };

  const getApiBasedOnParams = (id: any) => {
    let response;
    if (params?.get("marker_id")) {
      let body = {
        coordinates: placeDetails?.coordinates?.length
          ? placeDetails?.coordinates
          : popupFormData.coordinates,
        email: popupFormData?.email || "",
        host_organization: popupFormData?.host_organization || "",
        lls_region: popupFormData?.lls_region || "",
        location: popupFormData?.location || "",
        map_id: popupFormData?.map_id,
        name: popupFormData?.name || "",
        phone: popupFormData?.phone || "",
        position: popupFormData?.position || "",
        post_code: popupFormData?.post_code || "",
        images: popupFormData?.images,
      };

      response = updateMarkerDeatilsAPI(id, body, params?.get("marker_id"));
    } else {
      let body = {
        ...popupFormData,
        ...placeDetails,
      };
      response = addMarkerDeatilsAPI(id, body);
    }
    return response;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await getApiBasedOnParams(id);
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        setSingleMarkerData(response?.data);
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

  const handleImageInputChange = (event: any) => {
    setImageInput(event.target.value);
  };

  const handleAddImage = () => {
    if (!imageInput) {
      setErrorMessages({ images: "Image link cannot be empty." });
      return;
    }

    if (!popupFormData.images?.includes(imageInput)) {
      setPopupFormData({
        ...popupFormData,
        ["images"]: [...popupFormData.images, imageInput],
      });
      setImageInput("");
    } else {
      setErrorMessages({ images: "This link is already in the list." });
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleAddImage();
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = popupFormData.images.filter(
      (_: any, i: number) => i !== index
    );
    setPopupFormData({ ...popupFormData, images: updatedImages });
  };

  return (
    <Dialog
      open={showMarkerPopup}
      sx={{
        zIndex: "1300 !important",
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
          borderRadius: "8px",
        },
      }}
    >
      <div className="addMarkerDialog">
        <h3 className="dialogHeading">
          {params?.get("marker_id") ? "Update Marker" : "Add Marker"}
        </h3>
        <form>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "3rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <div className="eachFeildGrp">
                <label>Name</label>
                <TextField
                  className="defaultTextFeild text "
                  placeholder="Enter Name"
                  value={popupFormData?.name}
                  name="name"
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent errorMessage={errorMessages["name"]} />
              </div>
              <div className="eachFeildGrp">
                <label>Position</label>
                <TextField
                  className="defaultTextFeild text "
                  name="position"
                  placeholder="Enter Position"
                  value={popupFormData?.position}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["position"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Host Organization</label>
                <TextField
                  className="defaultTextFeild text "
                  name="host_organization"
                  placeholder="Enter Host Organization"
                  value={popupFormData?.host_organization}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["host_organization"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>LLS Region</label>
                <TextField
                  className="defaultTextFeild text "
                  name="lls_region"
                  placeholder="Enter LLS Region"
                  value={popupFormData?.lls_region}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["lls_region"]}
                />
              </div>
            </div>
            <div>
              <div className="eachFeildGrp">
                <label>Location</label>
                <TextField
                  className="defaultTextFeild text "
                  name="location"
                  placeholder="Enter Location"
                  value={popupFormData?.location}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["location"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Postcode</label>
                <TextField
                  className="defaultTextFeild text "
                  name="post_code"
                  placeholder="Enter Postcode"
                  value={popupFormData?.post_code}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["post_code"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Phone</label>
                <TextField
                  className="defaultTextFeild text "
                  name="phone"
                  placeholder="Enter Phone"
                  value={popupFormData?.phone}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent errorMessage={errorMessages["phone"]} />
              </div>
              <div className="eachFeildGrp">
                <label>Email</label>
                <TextField
                  className="defaultTextFeild text "
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={popupFormData?.email}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent errorMessage={errorMessages["email"]} />
              </div>
            </div>
          </div>
          <div className="eachFeildGrp">
            <label>Images</label>
            <TextField
              name="images"
              placeholder="Enter Images links"
              value={imageInput}
              onChange={handleImageInputChange}
              onKeyDown={handleKeyPress}
            />
            <Button onClick={handleAddImage}>Add</Button>
            <div className="imageList">
              {popupFormData?.images?.length > 0 ? (
                <ul>
                  {popupFormData.images.map((url: any, index: any) => (
                    <li key={index}>
                      <span>{url.slice(0, 40) + "...."}</span>
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No images added.</p>
              )}
            </div>
            <ErrorMessagesComponent errorMessage={errorMessages["images"]} />
          </div>
          <div className="actionBtnGrp">
            <Button onClick={handleCancel} disabled={loading ? true : false}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={popupFormData?.name ? false : true}
            >
              {loading ? (
                <CircularProgress
                  color="inherit"
                  sx={{ width: "10px", height: "10px" }}
                />
              ) : params?.get("marker_id") ? (
                "Update"
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
