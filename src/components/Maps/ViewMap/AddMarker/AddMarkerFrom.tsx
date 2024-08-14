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
import ImagesAddingComponent from "./ImagesAddingComponent";
import TagsAddingComponent from "./TagsAddingComponent";

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
  const [tagsInput, setTagsInput] = useState<any>("");
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
        organization_type: popupFormData?.organization_type || "",
        location: popupFormData?.location || "",
        map_id: popupFormData?.map_id,
        title: popupFormData?.title || "",
        phone: popupFormData?.phone || "",
        post_code: popupFormData?.post_code || "",
        images: popupFormData?.images,
        tags: popupFormData?.tags,
        town: popupFormData?.town || "",
        street_address: popupFormData.street_address || "",
        description: popupFormData?.description || "",
        website: popupFormData?.website || "",
        contact: popupFormData?.contact || "",
        fax: popupFormData?.fax || "",
        postal_address: popupFormData?.postal_address || "",
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

  return (
    <Dialog
      open={showMarkerPopup}
      sx={{
        zIndex: "1300 !important",
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "800px",
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
                <label>Title</label>
                <TextField
                  className="defaultTextFeild text "
                  placeholder="Enter Title"
                  value={popupFormData?.title}
                  name="title"
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent errorMessage={errorMessages["title"]} />
              </div>

              <div className="eachFeildGrp">
                <label>Organization Type</label>
                <TextField
                  className="defaultTextFeild text "
                  name="organisation_type"
                  placeholder="Enter Organization"
                  value={popupFormData?.organisation_type}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["organisation_type"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Contact</label>
                <TextField
                  className="defaultTextFeild text "
                  name="contact"
                  placeholder="Enter Contact"
                  value={popupFormData?.contact}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["contact"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Website</label>
                <TextField
                  className="defaultTextFeild text "
                  name="website"
                  placeholder="Enter Website link"
                  value={popupFormData?.website}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["website"]}
                />
              </div>
            </div>

            <div>
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
              <div className="eachFeildGrp">
                <label>Fax</label>
                <TextField
                  className="defaultTextFeild text "
                  name="fax"
                  placeholder="Enter Fax"
                  value={popupFormData?.fax}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent errorMessage={errorMessages["fax"]} />
              </div>
            </div>

            <div>
              <div className="eachFeildGrp">
                <label>Postal Address</label>
                <TextField
                  className="defaultTextFeild text "
                  name="postal_address"
                  placeholder="Enter Postal Address"
                  value={popupFormData?.postal_address}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["postal_address"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Street Address</label>
                <TextField
                  className="defaultTextFeild text "
                  name="street_address"
                  placeholder="Enter Street Address"
                  value={popupFormData?.street_address}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["street_address"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Postcode</label>
                <TextField
                  className="defaultTextFeild text "
                  name="postcode"
                  placeholder="Enter Postcode"
                  value={popupFormData?.postcode}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent
                  errorMessage={errorMessages["postcode"]}
                />
              </div>
              <div className="eachFeildGrp">
                <label>Town</label>
                <TextField
                  className="defaultTextFeild text "
                  name="town"
                  placeholder="Enter Town"
                  value={popupFormData?.town}
                  onChange={handleInputChange}
                />
                <ErrorMessagesComponent errorMessage={errorMessages["town"]} />
              </div>
            </div>
          </div>

          <div className="eachFeildGrp">
            <label>Description</label>
            <TextField
              className="defaultTextFeild text "
              name="description"
              rows={5}
              placeholder="Enter description"
              value={popupFormData?.description}
              onChange={handleInputChange}
            />
            <ErrorMessagesComponent
              errorMessage={errorMessages["description"]}
            />
          </div>
          <ImagesAddingComponent
            setImageInput={setImageInput}
            setErrorMessages={setErrorMessages}
            popupFormData={popupFormData}
            imageInput={imageInput}
            setPopupFormData={setPopupFormData}
            errorMessages={errorMessages}
          />
          <TagsAddingComponent
            setTagsInput={setTagsInput}
            setErrorMessages={setErrorMessages}
            popupFormData={popupFormData}
            tagsInput={tagsInput}
            setPopupFormData={setPopupFormData}
            errorMessages={errorMessages}
          />
          <div className="actionBtnGrp">
            <Button onClick={handleCancel} disabled={loading ? true : false}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={popupFormData?.title ? false : true}
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
