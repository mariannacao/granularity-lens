import React, { useState } from 'react';

function SegmentView({ text, segments }) {
  const [hoveredProposition, setHoveredProposition] = useState(null);
  const [showPassages, setShowPassages] = useState(true);
  const [showSentences, setShowSentences] = useState(true);
  const [showPropositions, setShowPropositions] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4 flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showPassages}
            onChange={(e) => setShowPassages(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">Passages</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showSentences}
            onChange={(e) => setShowSentences(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">Sentences</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showPropositions}
            onChange={(e) => setShowPropositions(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">Propositions</span>
        </label>
      </div>

      <div className="space-y-6">
        {/* Original Text */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Original Text</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
        </div>

        {/* Passages */}
        {showPassages && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Passages</h3>
            <div className="space-y-4">
              {segments.passages.map((passage, i) => (
                <div key={`passage-${i}`} className="bg-blue-50 p-3 rounded">
                  <span className="text-sm font-medium text-blue-700">Passage {i + 1}:</span>
                  <p className="mt-1 text-gray-700">{passage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sentences */}
        {showSentences && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sentences</h3>
            <div className="space-y-3">
              {segments.sentences.map((sentence, i) => (
                <div key={`sentence-${i}`} className="bg-green-50 p-3 rounded">
                  <span className="text-sm font-medium text-green-700">Sentence {i + 1}:</span>
                  <p className="mt-1 text-gray-700">{sentence.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Propositions */}
        {showPropositions && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Propositions</h3>
            <div className="space-y-3">
              {segments.propositions.map((proposition, i) => (
                <div
                  key={`proposition-${i}`}
                  className="bg-purple-50 p-3 rounded cursor-pointer hover:bg-purple-100 transition-colors"
                  onMouseEnter={() => setHoveredProposition(proposition)}
                  onMouseLeave={() => setHoveredProposition(null)}
                >
                  <span className="text-sm font-medium text-purple-700">Proposition {i + 1}:</span>
                  <p className="mt-1 text-gray-700">{proposition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proposition Details Tooltip */}
        {hoveredProposition && (
          <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md border">
            <h3 className="font-medium text-gray-900 mb-2">Proposition Details</h3>
            <p className="text-sm text-gray-600">{hoveredProposition}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SegmentView; 