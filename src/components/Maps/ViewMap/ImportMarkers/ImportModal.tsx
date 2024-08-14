import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  checkSheetHeaders,
  getImportedFilteredData,
  getPolygonWithMarkers,
  processImportedData,
} from "@/lib/helpers/mapsHelpers";
import {
  getStaticMapAPI,
  importMapAPI,
  updateMapWithCordinatesAPI,
} from "@/services/maps";
import Image from "next/image";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import ValidationsTable from "./ValidationsTable";
import { Button } from "@mui/material";
import MappingScreen from "./MappingComponent";

interface IImportModalProps {
  show: boolean;
  onClose: () => void;
  file: any;
  setFile: any;
  getData: any;
  mapDetails: any;
}

const ImportModal: React.FC<IImportModalProps> = ({
  show,
  onClose,
  file,
  setFile,
  getData,
  mapDetails,
}) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>();
  const [validationsData, setValidationsData] = useState<any>([]);
  const [success, setSuccess] = useState<any>(false);
  const [sheetHeaders, setSheetHeaders] = useState<any>([]);
  const [checkMapping, setCheckMapping] = useState<any>(false);
  const [sheetValues, setSheetValues] = useState<any>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "csv") {
        Papa.parse(file, {
          complete: async function (results: any) {
            let jsonData = results.data;
            let checkMappingvalue = checkSheetHeaders(jsonData[0]);
            if (!checkMappingvalue) {
              setCheckMapping(true);
              setSheetHeaders(jsonData[0]);
              setSheetValues(jsonData);
            } else {
              if (processImportedData(results.data)) {
                let markersData = await getImportedFilteredData({ jsonData });
                setValidationsData(markersData);
                await handleUpload(markersData);
              }
            }
          },
          header: false,
        });
      } else if (fileExtension == "xlsx") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          let checkMappingvalue = checkSheetHeaders(jsonData[0]);
          if (!checkMappingvalue) {
            setCheckMapping(true);
            setSheetHeaders(jsonData[0]);
            setSheetValues(jsonData);
          } else {
            if (processImportedData(jsonData)) {
              let markersData = await getImportedFilteredData({ jsonData });
              setValidationsData(markersData);
              await handleUpload(markersData);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast.error("Unsupported file format");
      }
    }
  };

  const getStaticMap = async (updatedCoords: any, coords: any) => {
    let body = {
      coordinates: [...coords, coords[0]],
      markers: updatedCoords,
    };
    try {
      const response = await getStaticMapAPI(body);
      if (response?.status == 200 || response?.status == 201) {
        return response?.data;
      } else {
        toast.error(response?.error_data.coordinates);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addMapWithCordinates = async (filedata: any) => {
    let updatedCoords = filedata[0]?.map((item: any) => item?.coordinates);
    let newCoords = updatedCoords.map((item: any) => {
      return {
        lat: item[0],
        lng: item[1],
      };
    });
    let coords = getPolygonWithMarkers(newCoords);

    let mapImage;
    mapImage = await getStaticMap(updatedCoords, coords);

    let body = {
      title: mapDetails?.title ? mapDetails?.title : "",
      description: mapDetails?.description ? mapDetails?.description : "",
      status: mapDetails?.status,
      geo_type: "polygon",
      geo_coordinates: coords,
      geo_zoom: 14,
      image: mapImage,
    };
    try {
      const response = await updateMapWithCordinatesAPI(body, id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (filedata: any) => {
    setLoading(true);

    try {
      let body = filedata[0];
      const response = await importMapAPI(id, body);

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response.message);
        if (filedata?.[0]?.length == 0) {
          await getData({});
          await addMapWithCordinates(filedata);
          onClose();
          setFile(null);
          setSuccess(true);
        } else {
          await getData({});
          await addMapWithCordinates(filedata);
          setSuccess(true);
        }
      } else if (response?.status === 422) {
        setErrorMessages(response?.errors);
        toast.error("Error: " + response?.message);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("An error occurred during upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="importModal">
      <div className="modalContent">
        <div className="modalHeader">
          <h2 className="modalHeading">Import Markers</h2>

          <Image
            src="/map/close-icon.svg"
            alt=""
            width={30}
            height={30}
            onClick={onClose}
          />
        </div>
        <div className="instructions">
          <Image src="/map/info-icon.svg" alt="" width={20} height={20} />
          <div className="content">
            <p>
              To import your markers, please ensure your CSV or XLSX file
              contains the following columns:
            </p>
            <ol>
              <li>
                [ Name, Position, Host Organisation, LLS Region, Phone, Email,
                Location, Postcode]
              </li>
            </ol>
            <p>
              Ensure all fields are correctly filled for a successful import.
            </p>
          </div>
        </div>

        <div {...getRootProps({ className: "dropzone " })}>
          <input {...getInputProps()} onChange={handleFileChange} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <div>
              <Image
                src="/map/file-upload-icon.svg"
                alt=""
                width={50}
                height={50}
              />
              <div>
                <p>
                  <u>Click to upload</u> or drag and drop a CSV or XLSX file
                  here
                </p>
                <p className="helperText">Max Size: 50MB</p>
              </div>
            </div>
          )}
        </div>
        <div className="fileUpload">
          {file && <p>Selected file: {file.name}</p>}
        </div>
        {checkMapping ? (
          <div>
            <MappingScreen
              sheetHeaders={sheetHeaders}
              setSheetHeaders={setSheetHeaders}
              jsonData={sheetValues}
              setValidationsData={setValidationsData}
              handleUpload={handleUpload}
              onClose={onClose}
              setCheckMapping={setCheckMapping}
            />
          </div>
        ) : (
          <div className="btnGrp">
            <Button onClick={onClose}>Close</Button>
            <Button
              onClick={handleFileUpload}
              disabled={file && !success ? false : true}
            >
              Confirm Upload
            </Button>
          </div>
        )}

        {validationsData?.length > 0 && !checkMapping ? (
          <ValidationsTable validationsData={validationsData} />
        ) : (
          ""
        )}
        <LoadingComponent loading={loading} />
      </div>
    </div>
  );
};

export default ImportModal;
