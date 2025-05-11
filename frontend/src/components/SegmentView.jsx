import React, { useState } from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';

function SegmentView({ text, segments }) {
  const [hoveredProposition, setHoveredProposition] = useState(null);
  const [showPassages, setShowPassages] = useState(true);
  const [showSentences, setShowSentences] = useState(true);
  const [showPropositions, setShowPropositions] = useState(true);

  const width = 800;
  const height = 400;
  const padding = 40;

  const xScale = scaleLinear({
    domain: [0, segments.propositions.length - 1],
    range: [padding, width - padding],
  });

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

      <div className="relative">
        <svg width={width} height={height}>
          <Group>
            {showPassages && segments.passages.map((passage, i) => (
              <g key={`passage-${i}`}>
                <rect
                  x={padding}
                  y={i * 60 + 20}
                  width={width - 2 * padding}
                  height={40}
                  className="passage-block"
                  rx={4}
                />
                <text
                  x={padding + 10}
                  y={i * 60 + 45}
                  className="text-sm text-gray-600"
                >
                  Passage {i + 1}
                </text>
              </g>
            ))}

            {showSentences && segments.sentences.map((sentence, i) => (
              <g key={`sentence-${i}`}>
                <rect
                  x={padding + 20}
                  y={i * 40 + 30}
                  width={width - 2 * padding - 40}
                  height={30}
                  className="sentence-block"
                  rx={4}
                />
                <text
                  x={padding + 30}
                  y={i * 40 + 50}
                  className="text-sm text-gray-600"
                >
                  Sentence {i + 1}
                </text>
              </g>
            ))}

            {showPropositions && segments.propositions.map((proposition, i) => (
              <g
                key={`proposition-${i}`}
                onMouseEnter={() => setHoveredProposition(proposition)}
                onMouseLeave={() => setHoveredProposition(null)}
              >
                <rect
                  x={xScale(i)}
                  y={height - 60}
                  width={100}
                  height={30}
                  className="proposition-block"
                  rx={4}
                />
                <text
                  x={xScale(i) + 5}
                  y={height - 40}
                  className="text-xs text-gray-600"
                >
                  Prop {i + 1}
                </text>
              </g>
            ))}
          </Group>
        </svg>

        {hoveredProposition && (
          <div className="absolute top-0 right-0 bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="font-medium text-gray-900 mb-2">Proposition Details</h3>
            <p className="text-sm text-gray-600">{hoveredProposition}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SegmentView; 