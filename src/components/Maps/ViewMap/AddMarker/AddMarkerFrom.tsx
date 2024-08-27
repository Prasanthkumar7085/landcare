import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import {
  addMarkerDeatilsAPI,
  getStaticMapAPI,
  updateMapWithCordinatesAPI,
  updateMarkerDeatilsAPI,
} from "@/services/maps";
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
import { getPolygonWithMarkers } from "@/lib/helpers/mapsHelpers";

const MarkerPopup = ({
  setShowMarkerPopup,
  showMarkerPopup,
  placeDetails,
  getSingleMapMarkers,
  removalMarker,
  popupFormData,
  setPopupFormData,
  setSingleMarkerData,
  getSingleMarker,
  mapDetails,
  allMarkers,
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

  const getStaticMap = async (updatedCoords: any, coords: any) => {
    let body = {
      coordinates:
        updatedCoords?.length == 1
          ? updatedCoords.map((item: any) => {
              return {
                lat: item[0],
                lng: item[1],
              };
            })
          : [...coords, coords[0]],
      markers: updatedCoords.slice(0, 50),
    };
    try {
      const response = await getStaticMapAPI(body);
      if (response?.status == 200 || response?.status == 201) {
        return response?.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateMapWithCordinates = async (allMarkers: any) => {
    let updatedCoords = allMarkers?.map((item: any) => item?.coordinates);
    let newCoords = updatedCoords.map((item: any) => {
      return {
        lat: item[0],
        lng: item[1],
      };
    });
    let coords = getPolygonWithMarkers(newCoords);

    let mapImage;
    mapImage = await getStaticMap(updatedCoords, coords || newCoords);

    let body = {
      title: mapDetails?.title ? mapDetails?.title : "",
      description: mapDetails?.description ? mapDetails?.description : "",
      status: mapDetails?.status,
      geo_type: "polygon",
      geo_coordinates: coords.map((item: any) => [item.lat, item.lng]),
      geo_zoom: 14,
      image: mapImage,
    };
    try {
      const response = await updateMapWithCordinatesAPI(body, id);
    } catch (err) {
      console.error(err);
    }
  };

  const getApiBasedOnParams = (id: any) => {
    let response;
    let body: any = {
      coordinates: placeDetails?.coordinates?.length
        ? placeDetails?.coordinates
        : popupFormData.coordinates,
      organisation_type: popupFormData?.organisation_type || "none",
      map_id: popupFormData?.map_id,
      title: popupFormData?.title || "",
      phone: popupFormData?.phone || null,
      postcode: placeDetails?.postcode
        ? placeDetails?.postcode
        : popupFormData?.postcode || null,
      images: popupFormData?.images,
      tags: popupFormData?.tags,
      town: placeDetails?.town
        ? placeDetails?.town
        : popupFormData?.town || null,
      street_address: placeDetails?.street_address
        ? placeDetails?.street_address
        : popupFormData.street_address || null,
      description: popupFormData?.description || null,
      website: popupFormData?.website || null,
      contact: popupFormData?.contact || null,
      fax: popupFormData?.fax || null,
      postal_address: placeDetails?.postal_address
        ? placeDetails?.postal_address
        : popupFormData?.postal_address || null,
    };
    if (popupFormData?.email) {
      body["email"] = popupFormData?.email;
    }
    if (params?.get("marker_id")) {
      response = updateMarkerDeatilsAPI(id, body, params?.get("marker_id"));
    } else {
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
        handleCancel();
        await getSingleMapMarkers({});
        if (params?.get("marker_id")) {
          await getSingleMarker(
            params?.get("marker_id"),
            popupFormData?.coordinates[0],
            popupFormData?.coordinates[1]
          );
          updateMapWithCordinates(allMarkers);
        }
        updateMapWithCordinates([...allMarkers, response?.data]);
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
          <div className="basicInformation">
            <h3 className="subHeading">Basic Information</h3>
            <div className="eachGrp">
              <div className="eachFeildGrp">
                <label>
                  Title<span style={{ color: "red" }}>*</span>
                </label>
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
                <label>Type</label>
                <TextField
                  className="defaultTextFeild text "
                  name="organisation_type"
                  placeholder="Enter Type"
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
            <div className="eachFeildGrp">
              <label>Description</label>
              <TextField
                className="defaultTextFeild multiline "
                name="description"
                rows={5}
                multiline
                placeholder="Enter description"
                value={popupFormData?.description}
                onChange={handleInputChange}
              />
              <ErrorMessagesComponent
                errorMessage={errorMessages["description"]}
              />
            </div>
          </div>
          <div className="locationInformation">
            <div className="subHeading">Location Information</div>
            <div className="eachGrp">
              <div className="eachFeildGrp">
                <label>Postal Address</label>
                <TextField
                  className="defaultTextFeild  "
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
                  className="defaultTextFeild  "
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
          </div>
          <div className="media">
            <div className="subHeading">Images</div>
            <ImagesAddingComponent
              setImageInput={setImageInput}
              setErrorMessages={setErrorMessages}
              popupFormData={popupFormData}
              imageInput={imageInput}
              setPopupFormData={setPopupFormData}
              errorMessages={errorMessages}
            />
          </div>
          <div className="tags">
            <div className="subHeading">Tags</div>
            <TagsAddingComponent
              setTagsInput={setTagsInput}
              setErrorMessages={setErrorMessages}
              popupFormData={popupFormData}
              tagsInput={tagsInput}
              setPopupFormData={setPopupFormData}
              errorMessages={errorMessages}
            />
          </div>
          <div className="actionBtnGrp">
            <Button onClick={handleCancel} disabled={loading ? true : false}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {loading ? (
                <CircularProgress color="inherit" size={"1.2rem"} />
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
