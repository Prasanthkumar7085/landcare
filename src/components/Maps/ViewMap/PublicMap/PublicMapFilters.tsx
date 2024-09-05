import AutoCompleteSearch from "@/components/Core/AutoCompleteSearch";
import { capitalizeFirstLetter } from "@/lib/helpers/nameFormate";
import { InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const PublicMapFilters = ({
  searchString,
  setSearchString,
  markersImagesWithOrganizationType,
  setSelectedOrginazation,
  selectedOrginazation,
  getSingleMapMarkers,
  setMarkers,
  setSingleMarkers,
  markers,
  singleMarkers,
}: any) => {
  const params: any = useSearchParams();
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

  const handleFilterChange = (searchString?: string, newValue?: any) => {
    const newSearchString = searchString
      ? searchString.toLowerCase().trim()
      : "";
    const selectedOrganization = newValue?.title ? newValue : "";

    let filteredMarkers: any[] = [...singleMarkers];

    if (selectedOrganization?.title) {
      filteredMarkers = filteredMarkers.filter(
        (item: any) => item?.type === selectedOrganization?.title
      );
    }
    if (newSearchString) {
      filteredMarkers = filteredMarkers.filter((item: any) =>
        [
          item?.name,
          item?.town,
          item?.host,
          item?.description,
          item?.contact,
          item?.landcare_region,
        ].some(
          (field) => field && field.toLowerCase().includes(newSearchString)
        )
      );
    }

    setMarkers(filteredMarkers);
    setSearchString(newSearchString);
    setSingleMarkers(singleMarkers);
    if (newValue) {
      setSelectedOrginazation(newValue);
    } else {
      setSelectedOrginazation(null);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchString = event.target.value.toLowerCase().trim();
    setSearchString(newSearchString);
    handleFilterChange(newSearchString, selectedOrginazation);
  };

  const handleSelectTypeChange = (newValue: any) => {
    if (newValue) {
      setSelectedOrginazation(newValue);
      handleFilterChange(searchString, newValue);
    } else {
      setSelectedOrginazation(null);
      handleFilterChange(searchString, "");
    }
  };

  return (
    <>
      <TextField
        variant="outlined"
        size="small"
        type="search"
        placeholder="Search "
        value={searchString}
        sx={{
          display: params?.get("marker_id") ? "none" : "",
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
      <div style={{ display: params?.get("marker_id") ? "none" : "" }}>
        <AutoCompleteSearch
          data={getOrginazationTypes() || []}
          setSelectValue={setSelectedOrginazation}
          selectedValue={selectedOrginazation}
          placeholder="Select Type"
          onChange={handleSelectTypeChange}
        />
      </div>
    </>
  );
};
export default PublicMapFilters;
