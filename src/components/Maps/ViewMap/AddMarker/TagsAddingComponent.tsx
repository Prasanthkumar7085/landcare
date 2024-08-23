import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import { useState } from "react";
import { truncateText } from "@/lib/helpers/nameFormate";
import Image from "next/image";

const TagsAddingComponent = ({
  setTagsInput,
  setErrorMessages,
  popupFormData,
  tagsInput,
  setPopupFormData,
  errorMessages,
}: any) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editInput, setEditInput] = useState<string>("");

  const handleTagsInputChange = (event: any) => {
    setTagsInput(event.target.value);
  };

  const handleAddTags = () => {
    setErrorMessages({});
    if (!tagsInput) {
      setErrorMessages({ tags: "Tags field cannot be empty." });
      return;
    }

    if (!popupFormData.tags?.includes(tagsInput)) {
      setPopupFormData({
        ...popupFormData,
        tags: [...popupFormData?.tags, tagsInput],
      });
      setTagsInput("");
    } else {
      setErrorMessages({ tags: "This tag is already in the list." });
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && editIndex === null) {
      handleAddTags();
    }
  };

  const handleRemoveTags = (index: number) => {
    const updatedTags = popupFormData.tags.filter(
      (_: any, i: number) => i !== index
    );
    setPopupFormData({ ...popupFormData, tags: updatedTags });
  };

  const handleEditTag = (index: number) => {
    setEditIndex(index);
    setEditInput(popupFormData.tags[index]);
  };

  const handleUpdateTag = () => {
    if (!editInput) {
      setErrorMessages({ tags: "Tags field cannot be empty." });
      return;
    }

    const updatedTags = [...popupFormData.tags];
    updatedTags[editIndex!] = editInput;

    setPopupFormData({ ...popupFormData, tags: updatedTags });
    setEditIndex(null);
    setEditInput("");
    setErrorMessages({});
  };

  return (
    <div className="eachFeildGrp">
      <div className="feildEntity">
        <TextField
          className="defaultTextFeild text"
          name="tags"
          placeholder="Enter Tags"
          sx={{ width: "100%" }}
          value={editIndex !== null ? editInput : tagsInput}
          onChange={(e) =>
            editIndex !== null
              ? setEditInput(e.target.value)
              : setTagsInput(e.target.value)
          }
          onKeyDown={handleKeyPress}
        />
        {editIndex !== null ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button className="addBtn update" onClick={handleUpdateTag}>
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
          <Button className="addBtn" onClick={handleAddTags}>
            +Add
          </Button>
        )}
      </div>
      <div className="tagList">
        {popupFormData?.tags?.length > 0 ? (
          <ul>
            {popupFormData.tags.map((tag: any, index: any) => (
              <li
                key={index}
                style={{ color: index == editIndex ? "red" : "" }}
              >
                <Tooltip title={tag && tag?.length > 15 ? tag : ""}>
                  <span>{truncateText(tag, 15)}</span>
                </Tooltip>
                <IconButton
                  onClick={() => handleEditTag(index)}
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
                  onClick={() => handleRemoveTags(index)}
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
      <ErrorMessagesComponent errorMessage={errorMessages["tags"]} />
    </div>
  );
};

export default TagsAddingComponent;
