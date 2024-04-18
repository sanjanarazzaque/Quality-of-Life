import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageDisplay = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('https://sixthsense-3e34d-default-rtdb.firebaseio.com/pics/base64');
        setImageSrc(response.data); // Assuming the response contains the image URL
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    const interval = setInterval(fetchImage, 5000); // Fetch image every 5 seconds
    return () => clearInterval(interval); // Cleanup function to clear interval

  }, []); // Empty dependency array ensures effect runs only once on mount

  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="Captured" />}
    </div>
  );
};

export default ImageDisplay;

export default App;
