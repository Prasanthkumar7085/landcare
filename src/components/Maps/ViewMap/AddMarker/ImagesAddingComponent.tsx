import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { useState } from "react";
import { truncateText } from "@/lib/helpers/nameFormate";

const ImagesAddingComponent = ({
  setImageInput,
  setErrorMessages,
  popupFormData,
  imageInput,
  setPopupFormData,
  errorMessages,
}: any) => {
  console.log(popupFormData, "popupFormData");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editInput, setEditInput] = useState<string>("");

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

  const handleEditImage = (index: number) => {
    setEditIndex(index);
    setEditInput(popupFormData.images[index]);
  };

  const handleUpdateImage = () => {
    if (!editInput) {
      setErrorMessages({ images: "Image link cannot be empty." });
      return;
    }

    if (popupFormData.images.includes(editInput)) {
      setErrorMessages({ images: "This link is already in the list." });
      return;
    }

    const updatedImages = [...popupFormData.images];
    updatedImages[editIndex!] = editInput;

    setPopupFormData({ ...popupFormData, images: updatedImages });
    setEditIndex(null);
    setEditInput("");
    setErrorMessages({});
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
          placeholder="Enter Image link"
          sx={{ width: "100%" }}
          value={editIndex !== null ? editInput : imageInput}
          onChange={(e) =>
            editIndex !== null
              ? setEditInput(e.target.value)
              : setImageInput(e.target.value)
          }
          onKeyDown={handleKeyPress}
        />
        {editIndex !== null ? (
          <>
            <Button onClick={handleUpdateImage}>Update</Button>
            <Button
              onClick={() => {
                setEditIndex(null);
                setEditInput("");
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={handleAddImage}>Add</Button>
        )}
      </div>
      <div className="imageList">
        {popupFormData?.images?.length > 0 ? (
          <ul>
            {popupFormData.images.map((url: any, index: any) => (
              <li
                key={index}
                style={{ color: index == editIndex ? "red" : "" }}
              >
                <Tooltip title={url && url?.length > 30 ? url : ""}>
                  <span>{truncateText(url, 30)}</span>
                </Tooltip>
                <IconButton
                  onClick={() => handleEditImage(index)}
                  aria-label="edit"
                  disabled={editIndex == index}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  aria-label="delete"
                  disabled={editIndex == index}
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
