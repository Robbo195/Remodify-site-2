import React, { useEffect, useState } from 'react';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('remodifySellerMessages') || '[]');
    // Show newest first
    setMessages(Array.isArray(stored) ? stored.slice().reverse() : []);
  }, []);

  const removeMessage = (index) => {
    // messages are reversed for display; compute real index
    const realIndex = messages.length - 1 - index;
    const raw = JSON.parse(localStorage.getItem('remodifySellerMessages') || '[]');
    raw.splice(realIndex, 1);
    localStorage.setItem('remodifySellerMessages', JSON.stringify(raw));
    setMessages(raw.slice().reverse());
  };

  

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 style={{ color: '#E63946', fontWeight: 700 }}>Messages</h2>
      </div>

      {messages.length === 0 ? (
        <div className="alert alert-light">You have no messages.</div>
      ) : (
        <div className="list-group">
          {messages.map((m, idx) => (
            <div key={idx} className="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-bold">{m.from || 'Seller'}</div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.message}</div>
                <small className="text-muted">{m.date ? new Date(m.date).toLocaleString() : ''}</small>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeMessage(idx)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
