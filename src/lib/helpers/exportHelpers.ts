import * as XLSX from "xlsx";
import { SheetHeaders } from "../constants/mapConstants";

export const exampleImportMarkersFile = () => {
  const worksheet = XLSX.utils.aoa_to_sheet([SheetHeaders]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "example-map-markers-import-templete.csv");
};
