import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  getCoordinates,
  getPolygonWithMarkers,
} from "@/lib/helpers/mapsHelpers";
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
  Divider,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
  const getValidCoordinates = async (
    popupFormData: any,
    placeDetails: any,
    town: string,
    postcode: string
  ): Promise<number[]> => {
    const extractCoordinates = (): number[] | undefined => {
      let coordinates: number[] | undefined;
      if (popupFormData?.coordinates?.length) {
        coordinates =
          typeof popupFormData.coordinates === "string"
            ? popupFormData.coordinates
                .split(",")
                .map((coord: any) => parseFloat(coord))
            : popupFormData.coordinates.map((coord: any) => parseFloat(coord));
      }
      // else {
      //   coordinates =
      //     typeof placeDetails?.coordinates === "string"
      //       ? placeDetails.coordinates
      //           .split(",")
      //           .map((coord: any) => parseFloat(coord))
      //       : placeDetails?.coordinates?.map((coord: any) => parseFloat(coord));
      // }

      return coordinates && coordinates.every((coord) => !isNaN(coord))
        ? coordinates
        : undefined;
    };

    const coordinates = extractCoordinates();

    if (coordinates) {
      return coordinates;
    } else {
      try {
        let townName = town?.includes("New South Wales")
          ? town
          : town + " " + "New South Wales";
        const townCoords: any = await getCoordinates(townName);
        return townCoords.length ? townCoords : await getCoordinates(postcode);
      } catch (error) {
        return (await getCoordinates(postcode)) as any;
      }
    }
  };

  const fetchCoordinates = async (
    popupFormData: any,
    placeDetails: any,
    town: string,
    postcode: string
  ) => {
    try {
      const coordinates = await getValidCoordinates(
        popupFormData,
        placeDetails,
        town,
        postcode
      );
      return coordinates;
    } catch (error) {
      return "";
    }
  };
  const getApiBasedOnParams = async (id: any) => {
    let response: any;
    let data = await fetchCoordinates(
      popupFormData,
      placeDetails,
      popupFormData?.town ? popupFormData?.town : placeDetails?.town || null,
      popupFormData?.postcode
        ? popupFormData?.postcode
        : placeDetails?.postcode || null
    );
    setPopupFormData({ ...popupFormData, ["coordinates"]: data });
    let body: any = {
      coordinates: data,
      type: popupFormData?.type || "",
      map_id: popupFormData?.map_id,
      name: popupFormData?.name || "",
      phone_number: popupFormData?.phone_number || null,
      postcode: placeDetails?.postcode
        ? placeDetails?.postcode
        : popupFormData?.postcode || "",
      image: popupFormData?.image,
      tags: popupFormData?.tags,
      landcare_region: popupFormData?.landcare_region || null,
      town: popupFormData?.town
        ? popupFormData?.town
        : placeDetails?.town || "",
      street_address: placeDetails?.street_address
        ? placeDetails?.street_address
        : popupFormData.street_address || null,
      description: popupFormData?.description || null,
      website: popupFormData?.website || null,
      contact: popupFormData?.contact || null,
      fax: popupFormData?.fax || null,
      facebook: popupFormData?.facebook || null,
      twitter: popupFormData?.twitter || null,
      instagram: popupFormData?.instagram || null,
      youtube: popupFormData?.youtube || null,
      host: popupFormData?.host || null,
      host_type: popupFormData?.host_type || null,
    };
    if (popupFormData?.email) {
      body["email"] = popupFormData?.email;
    }
    if (params?.get("marker_id")) {
      response = updateMarkerDeatilsAPI(id, body, popupFormData?.id);
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
      } else if (response?.status == 409) {
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
          maxWidth: "1000px",
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
          <div className="formFeildContainer">
            <div className="leftBlock">
              <div className="basicInformation">
                <h3 className="subHeading">
                  <Image
                    src="/markers/add/basic-info.svg"
                    alt=""
                    width={13}
                    height={13}
                  />{" "}
                  Basic Information
                </h3>
                <div className="eachGrp">
                  <div className="eachFeildGrp">
                    <label>
                      Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <TextField
                      className="defaultTextFeild text "
                      placeholder="Enter Name"
                      value={popupFormData?.name}
                      name="name"
                      onChange={handleInputChange}
                    />
                    <ErrorMessagesComponent
                      errorMessage={errorMessages["name"]}
                    />
                  </div>
                  <div className="eachFeildGrp">
                    <label>
                      Type<span style={{ color: "red" }}>*</span>
                    </label>
                    <TextField
                      className="defaultTextFeild text "
                      name="type"
                      placeholder="Enter Type"
                      value={popupFormData?.type}
                      onChange={handleInputChange}
                    />
                    <ErrorMessagesComponent
                      errorMessage={errorMessages["type"]}
                    />
                  </div>
                </div>
                <div className="eachFeildGrp">
                  <label>Description</label>
                  <TextField
                    className="defaultTextFeild multiline "
                    name="description"
                    rows={3}
                    multiline
                    placeholder="Enter Description"
                    value={popupFormData?.description}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["description"]}
                  />
                </div>
              </div>
              <div className="basicInformation">
                <h3 className="subHeading">
                  <Image
                    src="/markers/add/contact-info.svg"
                    alt=""
                    width={14}
                    height={14}
                  />{" "}
                  Contact Informaion
                </h3>
                <div className="eachGrp">
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
                    <label>Phone Number</label>
                    <TextField
                      className="defaultTextFeild text "
                      name="phone_number"
                      placeholder="Enter Phone Number"
                      value={popupFormData?.phone_number}
                      onChange={handleInputChange}
                    />
                    <ErrorMessagesComponent
                      errorMessage={errorMessages["phone_number"]}
                    />
                  </div>
                </div>
                <div className="eachFeildGrp">
                  <label>Email</label>
                  <TextField
                    className="defaultTextFeild text "
                    name="email"
                    placeholder="Enter Email"
                    value={popupFormData?.email}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["email"]}
                  />
                </div>
              </div>

              <div className="basicInformation">
                <h3 className="subHeading">
                  <Image
                    src="/markers/add/host-info.svg"
                    alt=""
                    width={14}
                    height={14}
                  />
                  Host Information
                </h3>
                <div className="eachGrp">
                  <div className="eachFeildGrp">
                    <label>Host</label>
                    <TextField
                      className="defaultTextFeild text "
                      name="host"
                      placeholder="Enter Host"
                      value={popupFormData?.host}
                      onChange={handleInputChange}
                    />
                    <ErrorMessagesComponent
                      errorMessage={errorMessages["host"]}
                    />
                  </div>
                  <div className="eachFeildGrp">
                    <label>Host Type</label>
                    <TextField
                      className="defaultTextFeild text "
                      name="host_type"
                      placeholder="Enter Host Type"
                      value={popupFormData?.host_type}
                      onChange={handleInputChange}
                    />
                    <ErrorMessagesComponent
                      errorMessage={errorMessages["host_type"]}
                    />
                  </div>
                </div>
              </div>
              <div className="basicInformation">
                <h3 className="subHeading">
                  <Image
                    src="/markers/add/media-info.svg"
                    alt=""
                    width={13}
                    height={13}
                  />
                  Media and Visuals
                </h3>
                <div className="eachFeildGrp">
                  <label>Image</label>
                  <TextField
                    className="defaultTextFeild text "
                    name="image"
                    placeholder="Enter Image link"
                    value={popupFormData?.image}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["image"]}
                  />
                </div>
                <div className="tags">
                  <label>Tags</label>
                  <TagsAddingComponent
                    setTagsInput={setTagsInput}
                    setErrorMessages={setErrorMessages}
                    popupFormData={popupFormData}
                    tagsInput={tagsInput}
                    setPopupFormData={setPopupFormData}
                    errorMessages={errorMessages}
                  />
                </div>
              </div>
            </div>
            <Divider orientation="vertical" variant="middle" />

            <div className="rightBlock">
              <div className="locationInformation">
                <div className="subHeading">
                  <Image
                    src="/markers/add/location-info.svg"
                    alt=""
                    width={13}
                    height={13}
                  />{" "}
                  Location Information
                </div>
                <div className="eachFeildGrp">
                  <label>Landcare Region</label>
                  <TextField
                    className="defaultTextFeild text "
                    name="landcare_region"
                    placeholder="Enter Landcare Region"
                    value={popupFormData?.landcare_region}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["landcare_region"]}
                  />
                </div>
                <div className="eachFeildGrp">
                  <label>Coordinates</label>
                  <TextField
                    className="defaultTextFeild  text"
                    name="coordinates"
                    placeholder="Enter Coordinates"
                    value={popupFormData?.coordinates}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={
                      errorMessages["coordinates,0"] ||
                      errorMessages["coordinates"]
                    }
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
                <div className="eachGrp">
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
                    <ErrorMessagesComponent
                      errorMessage={errorMessages["town"]}
                    />
                  </div>
                </div>
                {errorMessages["atleast_one_field"] ? (
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["atleast_one_field"]}
                  />
                ) : popupFormData?.coordinates?.length == 0 &&
                  !popupFormData?.town &&
                  !popupFormData?.postcode ? (
                  <ErrorMessagesComponent
                    errorMessage={
                      "At least one of coordinates, postcode, or town is required."
                    }
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="locationInformation">
                <div className="subHeading">
                  <Image
                    src="/markers/add/online-info.svg"
                    alt=""
                    width={13}
                    height={13}
                  />
                  Online Presence
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
                <div className="eachFeildGrp">
                  <label>Facebook Link</label>
                  <TextField
                    className="defaultTextFeild text "
                    name="facebook"
                    placeholder="Enter Facebook link"
                    value={popupFormData?.facebook}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["facebook"]}
                  />
                </div>
                <div className="eachFeildGrp">
                  <label>Instagram Link</label>
                  <TextField
                    className="defaultTextFeild text "
                    name="instagram"
                    placeholder="Enter Instagram link"
                    value={popupFormData?.instagram}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["instagram"]}
                  />
                </div>
                <div className="eachFeildGrp">
                  <label>X Link </label>
                  <TextField
                    className="defaultTextFeild text "
                    name="twitter"
                    placeholder="Enter X link"
                    value={popupFormData?.twitter}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["twitter"]}
                  />
                </div>
                <div className="eachFeildGrp">
                  <label>Youtube Link</label>
                  <TextField
                    className="defaultTextFeild text "
                    name="youtube"
                    placeholder="Enter Youtube link"
                    value={popupFormData?.youtube}
                    onChange={handleInputChange}
                  />
                  <ErrorMessagesComponent
                    errorMessage={errorMessages["youtube"]}
                  />
                </div>
              </div>
            </div>
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
      <LoadingComponent loading={loading} />
    </Dialog>
  );
};
export default MarkerPopup;
