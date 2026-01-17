import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportPDF(title, rows) {
  const doc = new jsPDF();
  doc.text(title, 14, 16);
  doc.autoTable({
    startY: 24,
    body: rows
  });
  doc.save(`${title}.pdf`);
}

export function exportExcel(title, rows) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buf]), `${title}.xlsx`);
}
