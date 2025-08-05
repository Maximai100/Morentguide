import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Morent Guide - Test</h1>
      <p>If you can see this, React is working!</p>
      <hr />
      <p>Check browser console for errors.</p>
      <button onClick={() => console.log('Button clicked!')}>
        Test Button
      </button>
    </div>
  );
}

export default TestApp;