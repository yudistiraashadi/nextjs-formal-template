import { exportDataGrid as exportExcelDataGrid } from "devextreme/excel_exporter";
import { exportDataGrid as exportPdfDataGrid } from "devextreme/pdf_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

/**
 * Get row number of a row in a data grid
 *
 * @param data
 * @returns
 */
export function getRowNumber(data: any) {
  return data.row.loadIndex + 1;
}

/**
 * Scrolling configuration for data grid
 */
export const SCROLLING_CONFIG = {
  useNative: true,
};

/**
 * Export to excel
 *
 * @param {any} e
 * @param {string} fileName
 * @returns
 */
export function exportExcel(e: any, fileName: string) {
  if (!window.confirm("Export to Excel?")) {
    return;
  }

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Main sheet");

  exportExcelDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        fileName + ".xlsx"
      );
    });
  });
}

/**
 * Export to PDF
 *
 * @param {any} e
 * @param {string} fileName
 * @returns
 */
export function exportPdf(e: any, fileName: string) {
  if (!window.confirm("Export to PDF?")) {
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
  });

  exportPdfDataGrid({
    jsPDFDocument: doc,
    component: e.component,
    margin: {
      top: 5,
      left: 5,
      right: 5,
      bottom: 5,
    },
  }).then(() => {
    doc.save(fileName + ".pdf");
  });
}
