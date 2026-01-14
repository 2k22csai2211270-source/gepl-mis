import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* EXPORT TO PDF */
export function exportToPDF(title, columns, rows) {
  const doc = new jsPDF();
  doc.text(title, 14, 15);

  doc.autoTable({
    startY: 20,
    head: [columns],
    body: rows
  });

  doc.save(`${title}.pdf`);
}

/* EXPORT TO EXCEL */
export function exportToExcel(fileName, data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream"
  });

  saveAs(fileData, `${fileName}.xlsx`);
}
