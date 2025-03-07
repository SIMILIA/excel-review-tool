import { useState } from 'react';
import { utils, write } from 'xlsx';
import './ReviewInterface.css';

function ReviewInterface({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  
  const currentItem = data[currentIndex];
  
  const handleReview = (isCorrect, note = '') => {
    setReviews([
      ...reviews,
      {
        index: currentIndex,
        isCorrect,
        note,
        question: currentItem.question,
        answer: currentItem.answer
      }
    ]);
    
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const exportToExcel = () => {
    const exportData = reviews.map(review => ({
      问题: review.question,
      回答: review.answer,
      评分结果: review.isCorrect ? '正确' : '错误',
      备注: review.note
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, '评审结果');
    
    write(wb, 'review-results.xlsx');
  };

  return (
    <div className="review-interface">
      <div className="header">
        <div className="progress">
          进度：{currentIndex + 1} / {data.length}
        </div>
        <button className="export-btn" onClick={exportToExcel}>
          导出结果
        </button>
      </div>
      <div className="left-panel">
        <div className="question-section">
          <h3>问题：</h3>
          <p>{currentItem.question}</p>
          <h3>回答：</h3>
          <p>{currentItem.answer}</p>
        </div>
        <div className="review-controls">
          <button onClick={() => handleReview(true)}>正确</button>
          <button onClick={() => handleReview(false)}>错误</button>
          <textarea 
            placeholder="添加备注..."
            onChange={(e) => handleReview(null, e.target.value)}
          />
        </div>
      </div>
      <div className="right-panel">
        <iframe 
          src={`https://www.gov.mo/zh-hant/services/${currentItem.serviceId}`}
          title="服务手续网站"
          referrerPolicy="no-referrer"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}

export default ReviewInterface; 