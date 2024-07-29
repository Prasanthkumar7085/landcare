import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from "./view-map.module.css";
import Papa from "papaparse";
import * as XLSX from 'xlsx';

interface IImportModalProps {
  show: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<IImportModalProps> = ({ show, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  console.log(file);
  const handleFileUpload = () => {
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); 
  
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          complete: function (results: any) {
            console.log(results.data,"results")
            const success = processParsedData(results.data);
            if (success) {
              // toast.success("File Uploaded Successfully");
            }
          },
          header: false,
        });
      } else if (fileExtension === 'xlsx') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
          console.log(worksheet);
          const success = processParsedData(worksheet);
          if (success) {
            // toast.success("File Uploaded Successfully");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // toast.error('Unsupported file format');
      }
    }
  };
  
  const processParsedData = (parsedData: any) => {
    setData(parsedData);
  
    const isEmpty = parsedData.every((row: any)=> row.every((cell: any)=> String(cell).trim() === ''));
    
    if (isEmpty) {
      // toast.error('File has empty data');
      return false; 
    }
    
    if (parsedData[0][0] === 'day' && parsedData[0][7] === 'bed_time') {
      const updatedPlanData = parsedData.slice(1, 8).map((row: any) => ({
        day: row[0],
        diet_plan: {
          early_morning: row[1],
          break_fast: row[2],
          mid_morning: row[3],
          lunch: row[4],
          evening_snacks: row[5],
          dinner: row[6],
          bed_time: row[7],
        },
      }));
    //   setWeeklyDietPlanData(updatedPlanData);
      return true; 
    } else {
      // toast.error('File does not match the required format');
      return false; 
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2 className={styles.modalh2}>Import</h2>
        <div className={styles.instructions}>
          <p>To import your markers, please ensure your CSV file contains the following columns:</p>
          <ol>
            <li>Marker Name: The name of the marker.</li>
            <li>Marker Type: The type of place (e.g., Hospital, Restaurant).</li>
            <li>Latitude Longitude: The geographical coordinates of the marker.</li>
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
              <p><u>Click to upload</u> or drag and drop a CSV file here</p>
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
        <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
        <button className={styles.uploadButton} onClick={handleFileUpload}>Confirm Upload</button>
      </div>
    </div>
  );
};

export default ImportModal;
