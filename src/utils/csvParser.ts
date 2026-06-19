import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { CsvRow } from "../types/csv";

/**
 * Parses a .csv file into an array of row objects keyed by header.
 */
export const parseCsvFile = (file: File): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

/**
 * Parses a .xlsx / .xls file into an array of row objects keyed by header,
 * using the first sheet in the workbook.
 */
export const parseExcelFile = (file: File): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];

        // defval ensures every row has every column, even if a cell is blank
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: "",
        });

        const normalized: CsvRow[] = rows.map((row) => {
          const stringRow: CsvRow = {};
          Object.keys(row).forEach((key) => {
            stringRow[key] = String(row[key]);
          });
          return stringRow;
        });

        resolve(normalized);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Detects file type by extension and routes to the correct parser.
 */
export const parseDataFile = (file: File): Promise<CsvRow[]> => {
  const name = file.name.toLowerCase();

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    return parseExcelFile(file);
  }

  if (name.endsWith(".csv")) {
    return parseCsvFile(file);
  }

  return Promise.reject(
    new Error("Unsupported file type. Please upload a .csv, .xlsx, or .xls file.")
  );
};
