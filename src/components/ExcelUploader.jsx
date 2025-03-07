import { useState } from 'react';
import { read, utils } from 'xlsx';
import './ExcelUploader.css';

function ExcelUploader({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const workbook = read(event.target.result);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json(worksheet);
        
        if (data.length === 0) {
          throw new Error('Excel文件是空的');
        }
        
        // 验证必要的列是否存在
        const requiredColumns = ['question', 'answer', 'serviceId'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
        if (missingColumns.length > 0) {
          throw new Error(`缺少必要的列: ${missingColumns.join(', ')}`);
        }

        onDataLoaded(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('文件读取失败');
      setLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="excel-uploader">
      <h2>Excel文件审核工具</h2>
      <p className="description">
        请上传包含问题、回答和服务编号的Excel文件
      </p>
      <label className="upload-button">
        选择文件
        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileUpload}
          disabled={loading}
          style={{ display: 'none' }}
        />
      </label>
      {loading && <div className="loading">正在处理文件...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default ExcelUploader; 