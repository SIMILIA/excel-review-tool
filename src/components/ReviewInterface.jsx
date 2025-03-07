import { useState } from 'react';
import { utils, write } from 'xlsx';
import './ReviewInterface.css';

function ReviewInterface({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showList, setShowList] = useState(false);
  
  const currentItem = data[currentIndex];
  
  const handleReview = (isCorrect, note = '') => {
    // 更新或添加评审记录
    const existingReviewIndex = reviews.findIndex(r => r.index === currentIndex);
    if (existingReviewIndex !== -1) {
      const updatedReviews = [...reviews];
      updatedReviews[existingReviewIndex] = {
        ...updatedReviews[existingReviewIndex],
        isCorrect: isCorrect !== null ? isCorrect : updatedReviews[existingReviewIndex].isCorrect,
        note: note || updatedReviews[existingReviewIndex].note
      };
      setReviews(updatedReviews);
    } else {
      setReviews([
        ...reviews,
        {
          index: currentIndex,
          isCorrect,
          note,
          question: currentItem.question,
          answer: currentItem.answer,
          serviceId: currentItem.serviceId
        }
      ]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const exportToExcel = () => {
    const exportData = reviews.map(review => ({
      问题: review.question,
      回答: review.answer,
      服务编号: review.serviceId,
      评分结果: review.isCorrect ? '正确' : '错误',
      备注: review.note || ''
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, '评审结果');
    
    // 使用当前日期时间作为文件名
    const now = new Date();
    const fileName = `review-results-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.xlsx`;
    
    write(wb, fileName);
  };

  // 获取当前记录的评审状态
  const currentReview = reviews.find(r => r.index === currentIndex);

  const handleSelectItem = (index) => {
    setCurrentIndex(index);
    setShowList(false);
  };

  return (
    <div className="review-interface">
      <div className="header">
        <div className="progress">
          进度：{currentIndex + 1} / {data.length}
          <button className="list-toggle" onClick={() => setShowList(!showList)}>
            {showList ? '隐藏列表' : '显示列表'}
          </button>
        </div>
        <button className="export-btn" onClick={exportToExcel}>
          导出结果
        </button>
      </div>
      <div className="main-content">
        {showList && (
          <div className="records-list">
            {data.map((item, index) => (
              <div 
                key={index}
                className={`record-item ${index === currentIndex ? 'active' : ''} ${
                  reviews.find(r => r.index === index)?.isCorrect === true ? 'correct' :
                  reviews.find(r => r.index === index)?.isCorrect === false ? 'incorrect' : ''
                }`}
                onClick={() => handleSelectItem(index)}
              >
                <div className="record-number">#{index + 1}</div>
                <div className="record-preview">
                  <div className="record-question">{item.question.substring(0, 50)}...</div>
                  <div className="record-status">
                    {reviews.find(r => r.index === index)?.isCorrect === true && '✓'}
                    {reviews.find(r => r.index === index)?.isCorrect === false && '✗'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="review-content">
          <div className="left-panel">
            <div className="question-section">
              <h3>问题：</h3>
              <p>{currentItem.question}</p>
              <h3>回答：</h3>
              <p>{currentItem.answer}</p>
              <a 
                href={`https://www.gov.mo/zh-hant/services/${currentItem.serviceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="service-link"
              >
                在新窗口查看服务网页
              </a>
            </div>
            <div className="review-controls">
              <div className="review-buttons">
                <button 
                  onClick={() => handleReview(true)}
                  className={currentReview?.isCorrect === true ? 'active' : ''}
                >
                  正确
                </button>
                <button 
                  onClick={() => handleReview(false)}
                  className={currentReview?.isCorrect === false ? 'active' : ''}
                >
                  错误
                </button>
              </div>
              <textarea 
                placeholder="添加备注..."
                value={currentReview?.note || ''}
                onChange={(e) => handleReview(null, e.target.value)}
              />
              <div className="navigation-buttons">
                <button onClick={handlePrevious} disabled={currentIndex === 0}>
                  上一条
                </button>
                <button onClick={handleNext} disabled={currentIndex === data.length - 1}>
                  下一条
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewInterface; 