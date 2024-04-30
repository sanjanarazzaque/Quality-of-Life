import React, { useState, useEffect } from 'react';

function App() {
  const [base64Image, setBase64Image] = useState('');
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // for button

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (base64Image) {
      displayText(base64Image);
    }
  }, [base64Image]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data.base64);
      setBase64Image(data.base64);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const displayText = async (base64Image) => {
    try {
      const apiKey = "API_KEY";
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                  },
                ],
              },
            ],
          }),
        }
      );

      const responseData = await response.json();
      const detections = responseData.responses[0].textAnnotations;
      const extractedText = detections && detections.length ? detections[0].description : 'No text found';

      setText(extractedText);

      // speak the extracted text
      speakText(extractedText);
    } catch (error) {
      console.error('Error detecting text:', error);
    }
  };

  const speakText = (textToSpeak) => {
    // check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      // create a new SpeechSynthesisUtterance object
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // set the language (optional)
      utterance.lang = 'en-US';

      // speak the text
      window.speechSynthesis.speak(utterance);

      // set the speaking state to true
      setIsSpeaking(true);

      // listen for the end of speech
      utterance.onend = () => {
        setIsSpeaking(false);
      };
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  };

  return (
    <div className="App">
      <h2>ViperVision Demo</h2>
      <img 
        src={`data:image/jpg;base64,${base64Image}`} 
        className='image' 
        alt='demo'
        style={{ width: '500px', height: '500px' }} // Adjust width and height as needed
      />
      {text && <div>Extracted Text: {text}</div>}
      {!isSpeaking && text && (
        <button onClick={() => speakText(text)}>Speak Text</button>
      )}
      {isSpeaking && (
        <button disabled>Speaking...</button>
      )}
    </div>
  );
  
  
}

export default App;