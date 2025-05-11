import React, { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import SegmentView from './components/SegmentView';
import { TENOR_API_KEY, TENOR_CLIENT_KEY } from './config';

function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingGif, setLoadingGif] = useState('');
  const [segments, setSegments] = useState({
    passages: [],
    sentences: [],
    propositions: []
  });

  const fetchRandomCatGif = async () => {
    try {
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?q=loading%20cat&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=50`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        setLoadingGif(data.results[randomIndex].media_formats.gif.url);
      }
    } catch (error) {
      console.error('Error fetching cat GIF:', error);
      setLoadingGif('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif');
    }
  };

  useEffect(() => {
    fetchRandomCatGif();
  }, []);

  const handleTextSubmit = async (inputText) => {
    setText(inputText);
    setIsLoading(true);
    setError(null);
    
    fetchRandomCatGif();
    
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
              src={loadingGif}
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