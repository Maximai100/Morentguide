import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Page - Morent Guide Works!</h1>
      <p>If you see this, React is working correctly.</p>
      <a href="/admin" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go to Admin Panel
      </a>
    </div>
  );
};

export default TestPage;