import { useState, useEffect } from 'react';
import ExcelUploader from './components/ExcelUploader';
import ReviewInterface from './components/ReviewInterface';

function App() {
  const [excelData, setExcelData] = useState(() => {
    // 从 localStorage 读取保存的 Excel 数据
    const savedData = localStorage.getItem('excelData');
    return savedData ? JSON.parse(savedData) : null;
  });

  // 当数据改变时保存到 localStorage
  useEffect(() => {
    if (excelData) {
      localStorage.setItem('excelData', JSON.stringify(excelData));
    }
  }, [excelData]);

  const handleClearAll = () => {
    localStorage.removeItem('excelData');
    localStorage.removeItem('excelReviewData');
    setExcelData(null);
  };

  return (
    <div className="app">
      {!excelData ? (
        <ExcelUploader onDataLoaded={setExcelData} />
      ) : (
        <div>
          <button 
            className="clear-all-btn" 
            onClick={handleClearAll}
            style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              zIndex: 1000,
              padding: '8px 16px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新上传文件
          </button>
          <ReviewInterface data={excelData} onClearAll={handleClearAll} />
        </div>
      )}
    </div>
  );
}

export default App; 