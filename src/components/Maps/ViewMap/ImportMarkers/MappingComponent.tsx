import { SheetHeaders } from "@/lib/constants/mapConstants";
import { exampleImportMarkersFile } from "@/lib/helpers/exportHelpers";
import {
  getImportedFilteredData,
  processImportedData,
} from "@/lib/helpers/mapsHelpers";
import {
  Autocomplete,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

const MappingScreen = ({
  sheetHeaders,
  setSheetHeaders,
  jsonData,
  setValidationsData,
  handleUpload,
  onClose,
  setCheckMapping,
}: any) => {
  const [mappedValues, setMappedValues] = useState<any>({});
  const [autocompleteSuggestions, setAutocompleteSuggestions] =
    useState<any>(SheetHeaders);
  useEffect(() => {
    const remainingSuggestions = SheetHeaders.filter(
      (item: any) => !Object.values(mappedValues).includes(item)
    );
    setAutocompleteSuggestions(remainingSuggestions);
  }, [mappedValues]);

  useEffect(() => {
    matchHeaders();
  }, [sheetHeaders]);

  const handleInputChange = (field: any, value: any) => {
    setMappedValues((prevState: any) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const matchHeaders = () => {
    const newMappedValues = sheetHeaders.reduce((acc: any, item: any) => {
      if (SheetHeaders.includes(item)) {
        acc[item] = item;
      } else {
        acc[item] = ""; // Set to empty if not found in SheetHeaders
      }
      return acc;
    }, {});
    setMappedValues(newMappedValues);
  };
  return (
    <div className="mapping-screen">
      <Typography variant="h6">Headers are not Macthed </Typography>
      <Typography variant="subtitle1">
        Please map according to correct headers
      </Typography>
      <Button variant="contained" onClick={exampleImportMarkersFile}>
        Download Template
      </Button>
      <Button onClick={matchHeaders}>Match Headers</Button>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Header</th>
              <th>Mapped Value</th>
            </tr>
          </thead>
          <tbody>
            {sheetHeaders.map((item: any, index: any) => (
              <tr key={index}>
                <td>{item}</td>
                <td>
                  <Autocomplete
                    className="defaultAutoComplete"
                    value={mappedValues[item] ? mappedValues[item] : null}
                    disablePortal
                    options={
                      autocompleteSuggestions?.length
                        ? autocompleteSuggestions
                        : []
                    }
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
                    onChange={(_: any, newValue: any) =>
                      handleInputChange(item, newValue)
                    }
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
                      <TextField
                        {...params}
                        placeholder={"Select mapped item"}
                        size="small"
                      />
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <div className="button-group">
            <Button
              type="button"
              onClick={() => {
                setMappedValues({});
                setSheetHeaders({});
                setAutocompleteSuggestions({});
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={
                Object.values(mappedValues)?.length == 15 ? false : true
              }
              onClick={async () => {
                let headers = Object.values(mappedValues);
                jsonData[0] = headers;
                if (processImportedData(jsonData)) {
                  let markersData = await getImportedFilteredData({ jsonData });
                  setValidationsData(markersData);
                  await handleUpload(markersData);
                  setCheckMapping(false);
                }
              }}
            >
              Save & Upload
            </Button>
          </div>
        </table>
      </div>
    </div>
  );
};

export default MappingScreen;
