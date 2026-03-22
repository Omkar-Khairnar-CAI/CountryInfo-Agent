import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { AgentResult } from './components/AgentResult';

const API_URL = 'http://localhost:8000';

function App() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body from stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let firstChunkReceived = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          if (!firstChunkReceived) {
            // Stop the major loading spinner since tokens are starting to flow
            setIsLoading(false);
            firstChunkReceived = true;
          }

          const chunkString = decoder.decode(value, { stream: true });
          const events = chunkString.split('\n\n');

          for (const ev of events) {
            if (ev.startsWith('data: ')) {
              try {
                const data = JSON.parse(ev.slice(6));

                if (data.error) {
                  setError(data.error);
                  break;
                }

                if (data.done) {
                  break;
                }

                if (data.chunk) {
                  setResult((prev) => (prev || '') + data.chunk);
                }
              } catch (e) {
                // Ignore parsing errors for partial event segments
              }
            }
          }
        }
      }
    } catch (err) {
      setError(`Error connecting to backend: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-emerald-500/30 flex flex-col">
      <header className="py-6 px-6 border-b border-gray-800 bg-[#0f0f0f] shadow-sm">
        <div className="flex items-center gap-3 w-full">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-800/80 rounded-xl border border-gray-700 shadow-sm">
            <span className="text-2xl">🌍</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Country Info Agent
            </h1>
            <p className="text-sm font-medium text-gray-400 mt-1">Single-Shot LangGraph Agent Invocation</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col p-6 mt-8 space-y-8">
        {/* Search / Invocation Area */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl text-gray-200 font-semibold mb-6 flex items-center gap-2">
            Invoke Agent
          </h2>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Results Area */}
        {(isLoading || result || error) && (
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl transition-all">
            <div className="mb-4 text-sm text-gray-500 font-medium">
              {currentQuery && <span>Query: <span className="text-emerald-400">"{currentQuery}"</span></span>}
            </div>
            <AgentResult result={result} isLoading={isLoading} error={error} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
