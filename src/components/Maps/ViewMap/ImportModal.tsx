import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from "./view-map.module.css";
import Papa from "papaparse";
import * as XLSX from 'xlsx';
import { importMapAPI } from '@/services/maps';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

interface IImportModalProps {
  show: boolean;
  onClose: () => void;
  file: any;
  setFile: any;
}

const ImportModal: React.FC<IImportModalProps> = ({ show, onClose,file,setFile}) => {
  const [loading,setLoading] = useState(false);
  const [errorMessages,setErrorMessages] = useState<any>();
  const { id } = useParams();

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
  const handleFileUpload = () => {
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); 
  
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          complete: function (results: any) {
            console.log(results.data,"results")
            const filedata = processParsedData(results.data);
            if (filedata) {
              handleUpload(filedata);
              setFile(null);
              toast.success("File Uploaded Successfully");
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
          const filedata = processParsedData(worksheet);
          console.log(filedata);
          if (filedata) {
            handleUpload(filedata);
            setFile(null);
            toast.success("File Uploaded Successfully");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        toast.error('Unsupported file format');
      }
    }
  };
  
  const processParsedData = (parsedData: any) => {
  
    const isEmpty = parsedData.every((row: any)=> row.every((cell: any)=> String(cell).trim() === ''));
    
    if (isEmpty) {
      toast.error('File has empty data');
      return false; 
    }
    
    if (parsedData[0][0] === 'title' && parsedData[0][11] === 'coordinates') {
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
      console.log(updatedPlanData,"apipayload");
      return updatedPlanData; 
    } else {
      toast.error('File does not match the required format');
      return false; 
    }
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