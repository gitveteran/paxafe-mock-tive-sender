'use client';

import { useState } from 'react';
import { generateTivePayload, generateMinimalPayload, samplePayloads } from '@/lib/payload-generator';
import { TivePayload } from '@/types/tive';

interface SendResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export default function MockTiveSenderPage() {
  const [apiUrl, setApiUrl] = useState('/api/webhook/tive');
  const [apiKey, setApiKey] = useState('');
  const [payload, setPayload] = useState<string>('');
  const [results, setResults] = useState<SendResult[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string>('');

  const handleGenerateRandom = () => {
    const newPayload = generateTivePayload();
    setPayload(JSON.stringify(newPayload, null, 2));
    setSelectedSample('');
  };

  const handleGenerateMinimal = () => {
    const newPayload = generateMinimalPayload();
    setPayload(JSON.stringify(newPayload, null, 2));
    setSelectedSample('');
  };

  const handleSelectSample = (sampleName: string) => {
    const sample = samplePayloads.find(s => s.name === sampleName);
    if (sample) {
      setPayload(JSON.stringify(sample.payload, null, 2));
      setSelectedSample(sampleName);
    }
  };

  const handleSend = async () => {
    if (!apiUrl.trim()) {
      alert('Please enter API URL');
      return;
    }

    if (!apiKey.trim()) {
      alert('Please enter API Key');
      return;
    }

    let parsedPayload: TivePayload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      alert('Invalid JSON payload');
      return;
    }

    setIsSending(true);
    const timestamp = new Date().toISOString();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(parsedPayload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setResults(prev => [{
          success: true,
          message: `Success: ${response.status} - ${data.message || 'Payload sent successfully'}`,
          timestamp,
        }, ...prev]);
      } else {
        setResults(prev => [{
          success: false,
          message: `Error ${response.status}: ${data.error || response.statusText}`,
          timestamp,
        }, ...prev]);
      }
    } catch (error) {
      setResults(prev => [{
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp,
      }, ...prev]);
    } finally {
      setIsSending(false);
    }
  };

  const handleBatchSend = async () => {
    if (!apiUrl.trim() || !apiKey.trim()) {
      alert('Please enter API URL and API Key');
      return;
    }

    setIsSending(true);
    const batchSize = 10;
    const results: SendResult[] = [];

    for (let i = 0; i < batchSize; i++) {
      const payload = generateTivePayload();
      const timestamp = new Date().toISOString();

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        results.push({
          success: response.ok,
          message: response.ok
            ? `Payload ${i + 1}/${batchSize}: Success`
            : `Payload ${i + 1}/${batchSize}: Error ${response.status}`,
          timestamp,
        });

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          success: false,
          message: `Payload ${i + 1}/${batchSize}: Network error`,
          timestamp,
        });
      }
    }

    setResults(prev => [...results, ...prev]);
    setIsSending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Tive Sender</h1>
        <p className="text-gray-600 mb-8">Generate and send test payloads to the Integration API</p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="http://localhost:3000/api/webhook/tive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your API key"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payload Generator</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleGenerateRandom}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Generate Random
            </button>
            <button
              onClick={handleGenerateMinimal}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Generate Minimal
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Payloads
            </label>
            <div className="flex flex-wrap gap-2">
              {samplePayloads.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample.name)}
                  className={`px-3 py-1 rounded-md text-sm transition ${
                    selectedSample === sample.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payload JSON
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Payload JSON will appear here..."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          
          <div className="flex gap-4">
            <button
              onClick={handleSend}
              disabled={isSending || !payload.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Payload'}
            </button>
            <button
              onClick={handleBatchSend}
              disabled={isSending}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Batch (10 payloads)'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    result.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.message}
                    </span>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            {results.length > 0 && (
              <button
                onClick={() => setResults([])}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Clear Results
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
