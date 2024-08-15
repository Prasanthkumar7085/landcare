import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";

const ImagesAddingComponent = ({
  setImageInput,
  setErrorMessages,
  popupFormData,
  imageInput,
  setPopupFormData,
  errorMessages,
}: any) => {
  const handleImageInputChange = (event: any) => {
    setImageInput(event.target.value);
  };

  const handleAddImage = () => {
    setErrorMessages({});

    if (!imageInput) {
      setErrorMessages({ images: "Image link cannot be empty." });
      return;
    }

    if (!popupFormData.images?.includes(imageInput)) {
      setPopupFormData({
        ...popupFormData,
        ["images"]: [...popupFormData?.images, imageInput],
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
    <div className="eachFeildGrp">
      <label>Images</label>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          className="defaultTextFeild text"
          name="images"
          placeholder="Enter Images links"
          sx={{ width: "100%" }}
          value={imageInput}
          onChange={handleImageInputChange}
          onKeyDown={handleKeyPress}
        />
        <Button onClick={handleAddImage}>Add</Button>
      </div>
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
  );
};

export default ImagesAddingComponent;
