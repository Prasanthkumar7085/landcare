import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./view-map.module.css";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { importMapAPI } from "@/services/maps";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface IImportModalProps {
  show: boolean;
  onClose: () => void;
  file: any;
  setFile: any;
}

const ImportModal: React.FC<IImportModalProps> = ({
  show,
  onClose,
  file,
  setFile,
}) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>();
  const [coordinates, setCoordinates] = useState<any>([]);

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
          complete: function (results: any) {
            // const filedata = processParsedData(results.data);
            if (results.data) {
              // handleUpload(filedata);
              setFile(null);
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

          const headers: any = jsonData[0];
          const subHeadersMapping: any = {
            Name: "name",
            Phone: "phone",
            Position: "position",
            Location: "location",
            Postcode: "post_code",
            "Host Organisation": "host_organization",
            "LLS Region": "lls_region",
            Email: "email",
          };
          const rows: any = jsonData.slice(1);

          const dataObjects = await Promise.allSettled(
            rows.map(async (row: any) => {
              let obj: any = {};
              headers.forEach((headerName: any, i: any) => {
                const mappedItem = subHeadersMapping[headerName];
                obj[mappedItem] = row[i];
              });
              if (obj["location"]) {
                const coords = await getCoordinates(obj["location"]);
                obj["coordinates"] = coords;
              }
              return obj;
            })
          );
          setFile(null);
          const filteredDataObjects = dataObjects.filter((obj) => {
            const values = Object.values(obj);
            return !values.every(
              (value) => value === undefined || value === "" || value === null
            );
          });
          console.log(filteredDataObjects, "mpsdkkskd");
          // await handleUpload(filteredDataObjects);
        };

        reader.readAsArrayBuffer(file);
      }
    } else {
      toast.error("Unsupported file format");
    }
  };

  const processParsedData = (parsedData: any) => {
    const isEmpty = parsedData.every((row: any) =>
      row.every((cell: any) => String(cell).trim() === "")
    );

    if (isEmpty) {
      toast.error("File has empty data");
      return false;
    }

    if (parsedData[0][0] === "title" && parsedData[0][11] === "coordinates") {
      const updatedPlanData = parsedData.slice(1, 12).map((row: any) => ({
        title: row[0],
        description: row[1],
        status: row[2],
        type: row[3],
        full_address: row[4],
        state: row[5],
        city: row[6],
        zipcode: row[7],
        tags: row[8],
        social_links: row[9],
        added_by: row[10],
        coordinates: row[11],
      }));
      return updatedPlanData;
    } else {
      toast.error("File does not match the required format");
      return false;
    }
  };

  const getCoordinates = (locationName: any) => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationName }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          resolve([lat(), lng()]);
        } else {
          reject(`Error fetching coordinates for ${locationName}: ${status}`);
        }
      });
    });
  };

  const handleUpload = async (filedata: any) => {
    setLoading(true);

    try {
      let body = filedata;
      const response = await importMapAPI(id, body);

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response.message);
        onClose();
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

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2 className={styles.modalh2}>Import</h2>
        <div className={styles.instructions}>
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
          <p>Ensure all fields are correctly filled for a successful import.</p>
        </div>
        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} onChange={handleFileChange} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <>
              <p>
                <u>Click to upload</u> or drag and drop a CSV file here
              </p>
              <br />
              <div>
                <span>Max Size: 50MB</span>
              </div>
            </>
          )}
        </div>
        <div className={styles.fileUpload}>
          {file && <p>Selected file: {file.name}</p>}
        </div>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button className={styles.uploadButton} onClick={handleFileUpload}>
          Confirm Upload
        </button>
      </div>
    </div>
  );
};

export default ImportModal;
