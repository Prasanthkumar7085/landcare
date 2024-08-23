import AutoCompleteSearch from "@/components/Core/AutoCompleteSearch";
import { capitalizeFirstLetter } from "@/lib/helpers/nameFormate";
import { InputAdornment, TextField } from "@mui/material";
import Image from "next/image";

const PublicMapFilters = ({
  searchString,
  setSearchString,
  markersImagesWithOrganizationType,
  setSelectedOrginazation,
  selectedOrginazation,
  getSingleMapMarkers,
}: any) => {
  const getOrginazationTypes = () => {
    let orginisationTypesOptions: any = Object?.keys(
      markersImagesWithOrganizationType
    ).map((key: any) => ({
      title: key,
      label: capitalizeFirstLetter(key) || key,
      img: markersImagesWithOrganizationType[key],
    }));

    return orginisationTypesOptions;
  };

  const handleSearchChange = (event: any) => {
    const newSearchString = event.target.value;
    setSearchString(newSearchString);
    getSingleMapMarkers({
      search_string: encodeURIComponent(newSearchString),
    });
  };

  const handleSelectTypeChange = (newValue: any) => {
    if (newValue) {
      setSelectedOrginazation(newValue);
      getSingleMapMarkers({
        type: newValue?.title,
      });
    } else {
      setSelectedOrginazation(null);
      getSingleMapMarkers({
        type: "",
      });
    }
  };

  return (
    <>
      <TextField
        variant="outlined"
        size="small"
        type="search"
        placeholder="Search on title"
        value={searchString}
        sx={{
          "& .MuiInputBase-root": {
            height: "38px",
            border: "1.4px solid #c8c7ce",
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f2f2f2",
            width: " 100%",
            height: "38px",
            background: "#ffffff",
            color: "black",
            fontWeight: 500,
            fontSize: "12px",
            padding: "8px 13px",
            boxSizing: " border-box",
            borderRadius: "6px",
            fontFamily: "Poppins",
          },
          fieldset: {
            border: " 0 !important",
          },
        }}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Image src="/search-icon.svg" alt="" width={15} height={15} />
            </InputAdornment>
          ),
        }}
      />
      <AutoCompleteSearch
        data={getOrginazationTypes() || []}
        setSelectValue={setSelectedOrginazation}
        selectedValue={selectedOrginazation}
        placeholder="Select Type"
        onChange={handleSelectTypeChange}
      />
    </>
  );
};
export default PublicMapFilters;
