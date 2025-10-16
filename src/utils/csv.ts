// export const makecsv = (table?: HTMLTableElement): string => {
//   let data = "";
//   Array.from(table?.rows || []).map((row: HTMLTableRowElement) => {
//     let r = "";
//     Array.from(row.cells).map((cell: HTMLTableCellElement) => {
//       r += cell.innerText + ",";
//     });
//     if (r.replaceAll(",", "").trim().length < 1) return;
//     data += r + "\n";
//   });
//   return data;
// };

// export const download = (
//   filename: string,
//   table?: HTMLElement,
//   window?: Window,
// ): void => {
//   if (!table) {
//     return;
//   }

//   const d = makecsv(table.querySelector("table") as HTMLTableElement);
//   const CSVFile = new Blob([d], {
//     type: "text/csv",
//   });

//   // Create to temporary link to initiate
//   // download process
//   const temp_link = document.createElement("a");

//   // Download csv file
//   temp_link.download = filename + ".csv";
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //@ts-ignore
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
//   const url = window.URL.createObjectURL(CSVFile);
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   temp_link.href = url;

//   // This link should not be displayed
//   temp_link.style.display = "none";
//   document.body.appendChild(temp_link);

//   temp_link.click();
//   document.body.removeChild(temp_link);
// };

// export const makecsv = (table?: HTMLTableElement): string => {
//   let data = "";
//   Array.from(table?.rows || []).map((row: HTMLTableRowElement) => {
//     let r = "";
//     Array.from(row.cells).map((cell: HTMLTableCellElement) => {
//       const customdata = cell.querySelector("[data-custom]");
//       r +=
//         (customdata
//           ? customdata.getAttribute("data-custom")
//           : cell.innerText
//         )?.replaceAll(",", "") + ",";
//     });
//     if (r.replaceAll(",", "").trim().length < 1) return;
//     data += r + "\n";
//   });
//   return data;
// };

export const makecsv = (table?: HTMLTableElement): string => {
  let data = "";
  Array.from(table?.rows ?? []).forEach((row: HTMLTableRowElement) => {
    let r = "";
    Array.from(row.cells).forEach((cell: HTMLTableCellElement) => {
      const customdata = cell.querySelector("[data-custom]");
      let cellValue = customdata
        ? customdata.getAttribute("data-custom")
        : cell.innerText;
      if (cellValue) {
        // Escape double quotes by doubling them
        cellValue = cellValue.replace(/"/g, '""');
        // Enclose in double quotes if there are any special characters
        if (
          cellValue.includes(",") ||
          cellValue.includes('"') ||
          cellValue.includes("\n")
        ) {
          cellValue = `"${cellValue}"`;
        }
      }
      r += cellValue + ",";
    });
    // Remove trailing comma and add newline
    if (r.replaceAll(",", "").trim().length > 0) {
      data += r.slice(0, -1) + "\n";
    }
  });
  return data;
};

export const download = (
  filename: string,
  table?: HTMLElement,
  window?: Window
): void => {
  if (!table) {
    return;
  }

  const d = makecsv(table.querySelector("table") as HTMLTableElement);
  const element = window?.document.createElement("a");
  element?.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + "\uFEFF" + encodeURIComponent(d)
  );
  element?.setAttribute("download", filename + ".csv");
  if (element) {
    element.style.display = "none";
    window?.document.body.appendChild(element);
    element?.click();
    window?.document.body.removeChild(element);
  }
};
