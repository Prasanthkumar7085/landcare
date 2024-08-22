import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Paper } from "@mui/material";
import Image from "next/image";

const AutoCompleteSearch = ({
  data,
  setSelectValue,
  selectedValue,
  placeholder,
}: any) => {
  const handleChange = (_: any, newValue: any) => {
    setSelectValue(newValue);
  };

  return (
    <Autocomplete
      className="defaultAutoComplete"
      value={selectedValue ? selectedValue : null}
      disablePortal
      options={data?.length ? data : []}
      PaperComponent={({ children }: any) => (
        <Paper
          sx={{
            fontSize: "12px",
            fontFamily: "'Poppins', Sans-serif",
            fontWeight: "500",
          }}
        >
          {children}
        </Paper>
      )}
      getOptionLabel={(option: any) =>
        typeof option === "string" ? option : option?.["label"]
      }
      renderOption={(props: any, option: any) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={option.label}
            component="li"
            sx={{
              "& > img": { mr: 2, flexShrink: 0 },
            }}
            {...optionProps}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              {option.img ? (
                <img src={option?.img} width={12} height={12} alt="type" />
              ) : (
                ""
              )}

              {option.label}
            </div>
          </Box>
        );
      }}
      onChange={handleChange}
      sx={{
        "& .MuiFormControl-root": {
          width: "170px",
          background: "#fff",
        },
        "& .MuiPopper-root": {
          zIndex: "9999999999 !important",
        },
      }}
      renderInput={(params: any) => (
        <TextField {...params} placeholder={placeholder} size="small" />
      )}
    />
  );
};

export default AutoCompleteSearch;
