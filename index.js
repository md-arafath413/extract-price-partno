import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const processed = jsonData.map(row => {
        const titlePart = (row.title || "").split("|")[1]?.trim() || "";
        const price = row.price || "";
        return { title: titlePart, price };
      });

      setData(processed);
    };

    reader.readAsBinaryString(file);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExtractedData");
    XLSX.writeFile(wb, "Extracted_PartPrice.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Extract Price & Title</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {data.length > 0 && (
        <div>
          <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
            <thead>
              <tr><th>Title</th><th>Price</th></tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.title}</td>
                  <td>{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDownload} style={{ marginTop: 20 }}>Download Excel</button>
        </div>
      )}
    </div>
  );
}