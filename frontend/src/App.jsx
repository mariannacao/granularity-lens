import React, { useState } from 'react';
import TextInput from './components/TextInput';
import SegmentView from './components/SegmentView';

const loadingCats = [ 
   "https://tenor.com/bkgBd.gif",
   "https://tenor.com/td5Mu7SFNe5.gif",
   "https://tenor.com/bsifJ.gif",
   "https://tenor.com/oEw4o5oyOSc.gif",
];

function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [segments, setSegments] = useState({
    passages: [],
    sentences: [],
    propositions: []
  });

  const getRandomCatGif = () => {
    const randomIndex = Math.floor(Math.random() * loadingCats.length);
    return loadingCats[randomIndex];
  };

  const handleTextSubmit = async (inputText) => {
    setText(inputText);
    setIsLoading(true);
    setError(null);
    
    try {
      // passages (100-word chunks)
      const words = inputText.split(/\s+/);
      const passages = [];
      for (let i = 0; i < words.length; i += 100) {
        passages.push(words.slice(i, i + 100).join(' '));
      }
      
      // sentences
      const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [];
      
      // propositions 
      console.log('making API request to:', 'http://127.0.0.1:8000/propositions');
      console.log('request payload:', { text: inputText });
      
      const response = await fetch('http://127.0.0.1:8000/propositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      console.log('response status:', response.status);
      console.log('response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API response:', data); 
      
      setSegments({
        passages,
        sentences,
        propositions: data.propositions
      });
    } catch (error) {
      console.error('error fetching propositions:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Granularity Lens
        </h1>
        
        <TextInput onSubmit={handleTextSubmit} disabled={isLoading} />
        
        {isLoading && (
          <div className="text-center py-8">
            <img 
              src={getRandomCatGif()}
              alt="Loading cat" 
              className="w-32 h-32 mx-auto mb-4"
            />
            <p className="text-lg font-medium text-gray-700">Processing your text...</p>
            <p className="text-sm text-gray-500 mt-2">Catto is thinking</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {text && !isLoading && !error && (
          <SegmentView
            text={text}
            segments={segments}
          />
        )}
      </div>
    </div>
  );
}

export default App; 