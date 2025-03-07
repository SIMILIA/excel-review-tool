import { useState } from 'react';
import ExcelUploader from './components/ExcelUploader';
import ReviewInterface from './components/ReviewInterface';

function App() {
  const [excelData, setExcelData] = useState(null);

  return (
    <div className="app">
      {!excelData ? (
        <ExcelUploader onDataLoaded={setExcelData} />
      ) : (
        <ReviewInterface data={excelData} />
      )}
    </div>
  );
}

export default App; 