import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";

const TagsAddingComponent = ({
  setTagsInput,
  setErrorMessages,
  popupFormData,
  tagsInput,
  setPopupFormData,
  errorMessages,
}: any) => {
  const handleTagsInputChange = (event: any) => {
    setTagsInput(event.target.value);
  };

  const handleAddTags = () => {
    setErrorMessages({});
    if (!tagsInput) {
      setErrorMessages({ tags: "tags feild cannot be empty." });
      return;
    }

    if (!popupFormData.tags?.includes(tagsInput)) {
      setPopupFormData({
        ...popupFormData,
        ["tags"]: [...popupFormData?.tags, tagsInput],
      });
      setTagsInput("");
    } else {
      setErrorMessages({ tags: "This tag is already in the list." });
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleAddTags();
    }
  };

  const handleRemoveTags = (index: number) => {
    const updatedTags = popupFormData.tags.filter(
      (_: any, i: number) => i !== index
    );
    setPopupFormData({ ...popupFormData, tags: updatedTags });
  };
  return (
    <div className="eachFeildGrp">
      <label>Tags</label>
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
          placeholder="Enter Tags"
          sx={{ width: "100%" }}
          value={tagsInput}
          onChange={handleTagsInputChange}
          onKeyDown={handleKeyPress}
        />
        <Button onClick={handleAddTags}>Add</Button>
      </div>
      <div className="imageList">
        {popupFormData?.tags?.length > 0 ? (
          <ul>
            {popupFormData.tags.map((url: any, index: any) => (
              <li key={index}>
                <span>{url.slice(0, 40) + "...."}</span>
                <IconButton
                  onClick={() => handleRemoveTags(index)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tags added.</p>
        )}
      </div>
      <ErrorMessagesComponent errorMessage={errorMessages["tags"]} />
    </div>
  );
};

export default TagsAddingComponent;
