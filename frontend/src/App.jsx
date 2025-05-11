import React, { useState } from 'react';
import TextInput from './components/TextInput';
import SegmentView from './components/SegmentView';

function App() {
  const [text, setText] = useState('');
  const [segments, setSegments] = useState({
    passages: [],
    sentences: [],
    propositions: []
  });

  const handleTextSubmit = async (inputText) => {
    setText(inputText);
    
    // Split into passages (100-word chunks)
    const words = inputText.split(/\s+/);
    const passages = [];
    for (let i = 0; i < words.length; i += 100) {
      passages.push(words.slice(i, i + 100).join(' '));
    }
    
    // Split into sentences
    const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [];
    
    // Get propositions from API
    try {
      const response = await fetch('/api/propositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      
      setSegments({
        passages,
        sentences,
        propositions: data.propositions
      });
    } catch (error) {
      console.error('Error fetching propositions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Granularity Lens
        </h1>
        
        <TextInput onSubmit={handleTextSubmit} />
        
        {text && (
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