import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { useState } from "react";
import { truncateText } from "@/lib/helpers/nameFormate";
import Image from "next/image";

const ImagesAddingComponent = ({
  setImageInput,
  setErrorMessages,
  popupFormData,
  imageInput,
  setPopupFormData,
  errorMessages,
}: any) => {
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
    const updatedImages = [...popupFormData.images];
    updatedImages[editIndex!] = editInput;

    setPopupFormData({ ...popupFormData, images: updatedImages });
    setEditIndex(null);
    setEditInput("");
    setErrorMessages({});
  };

  return (
    <div className="eachFeildGrp">
      <div className="feildEntity">
        <TextField
          className="defaultTextFeild text"
          name="images"
          placeholder="Paste link here"
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button className="addBtn update" onClick={handleUpdateImage}>
              Update
            </Button>
            <Button
              className="addBtn cancel"
              onClick={() => {
                setEditIndex(null);
                setEditInput("");
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button className="addBtn" onClick={handleAddImage}>
            +Add
          </Button>
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
                <Tooltip title={url && url?.length > 45 ? url : ""}>
                  <span>{truncateText(url, 45)}</span>
                </Tooltip>
                <IconButton
                  onClick={() => handleEditImage(index)}
                  aria-label="edit"
                  disabled={editIndex == index}
                >
                  <Image
                    src="/markers/add/edit.svg"
                    alt="edit"
                    width={15}
                    height={15}
                  />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  aria-label="delete"
                  disabled={editIndex == index}
                >
                  <Image
                    src="/markers/add/delete.svg"
                    alt="edit"
                    width={15}
                    height={15}
                  />
                </IconButton>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>
      <ErrorMessagesComponent errorMessage={errorMessages["images"]} />
    </div>
  );
};

export default ImagesAddingComponent;
