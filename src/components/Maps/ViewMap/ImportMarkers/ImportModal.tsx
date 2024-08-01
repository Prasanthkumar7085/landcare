import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  getImportedFilteredData,
  processImportedData,
} from "@/lib/helpers/mapsHelpers";
import { importMapAPI } from "@/services/maps";
import Image from "next/image";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import ValidationsTable from "./ValidationsTable";

interface IImportModalProps {
  show: boolean;
  onClose: () => void;
  file: any;
  setFile: any;
  getData: any;
}

const ImportModal: React.FC<IImportModalProps> = ({
  show,
  onClose,
  file,
  setFile,
  getData,
}) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>();
  const [coordinates, setCoordinates] = useState<any>([]);
  const [validationsData, setValidationsData] = useState<any>([]);

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
            if (processImportedData(results.data)) {
              let markersData = await getImportedFilteredData({ jsonData });
              console.log(markersData, "sdkkdskdksakdskk");
              setValidationsData(markersData[1]);
              // await handleUpload(markersData[0]);
            }
          },
          header: false,
        });
      } else if (fileExtension === "xlsx") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (processImportedData(jsonData)) {
            let markersData = await getImportedFilteredData({ jsonData });
            setValidationsData(markersData[1]);
            // await handleUpload(markersData[0]);
          }
          reader.readAsArrayBuffer(file);
        };
      } else {
        toast.error("Unsupported file format");
      }
    }
  };

  const handleUpload = async (filedata: any) => {
    setLoading(true);

    try {
      let body = filedata;
      const response = await importMapAPI(id, body);

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response.message);
        if (validationsData?.length == 0) {
          getData({});
          onClose();
          setFile(null);
        } else {
          getData({});
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
          <h2 className="modalHeading">Import</h2>

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
              To import your markers, please ensure your CSV file contains the
              following columns:
            </p>
            <ol>
              <li>Marker Name: The name of the marker.</li>
              <li>
                Marker Type: The type of place (e.g., Hospital, Restaurant).
              </li>
              <li>
                Latitude Longitude: The geographical coordinates of the marker.
              </li>
              <li>Description: A brief description of the marker.</li>
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
                  <u>Click to upload</u> or drag and drop a CSV file here
                </p>
                <p className="helperText">Max Size: 50MB</p>
              </div>
            </div>
          )}
        </div>
        <div className="fileUpload">
          {file && <p>Selected file: {file.name}</p>}
        </div>
        <div className="btnGrp">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleFileUpload}>Confirm Upload</button>
        </div>
        {validationsData?.length > 0 ? (
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
