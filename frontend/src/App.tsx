import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { AgentResult } from './components/AgentResult';
import { Globe, Sun, Moon } from 'lucide-react';

const API_URL = 'http://localhost:8000';

function App() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

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
                // Ignore parse errors for partial chunks
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
    <div className="h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col overflow-hidden relative transition-colors duration-500">
      {/* Decorative background blobs - dynamically dimmed for dark mode */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-60 dark:opacity-30 transition-opacity duration-500">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-200/60 dark:bg-emerald-600/50 mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/60 dark:bg-indigo-600/50 mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-pink-200/60 dark:bg-purple-600/50 mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <header className="shrink-0 py-5 px-8 border-b border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm z-10 transition-colors duration-500">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 text-white">
              <Globe size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
                Country Intelligence
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">Global API Agent Engine</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-white/60 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 shadow-sm transition-all"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col lg:flex-row gap-8 p-8 min-h-0 z-10">
        {/* Left Column: Search */}
        <section className="flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col overflow-y-auto transition-colors duration-500">
          <h2 className="text-2xl text-slate-800 dark:text-white font-bold mb-8 flex items-center gap-3 shrink-0 transition-colors">
            Ask the Agent
          </h2>
          <div className="shrink-0">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="mt-10 overflow-y-auto pr-2">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-4 transition-colors">Suggested Queries</h3>
            <div className="flex flex-col gap-3">
              {[
                'What is the population and capital of Brazil?',
                'Which countries use the Euro?',
                'Name 5 French speaking countries in Africa.',
                'Currency and Region of Japan'
              ].map(q => (
                <button
                  key={q}
                  onClick={() => !isLoading && handleSearch(q)}
                  disabled={isLoading}
                  className="text-left px-5 py-4 rounded-xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-700/60 border border-white/50 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-semibold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Results Area */}
        <section className="flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col overflow-y-auto relative transition-colors duration-500">
          {(isLoading || result || error) ? (
            <>
              <div className="mb-6 pb-5 border-b border-slate-200/60 dark:border-slate-700/60 shrink-0 transition-colors">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Current Query</p>
                {currentQuery && <p className="text-xl text-indigo-900 dark:text-indigo-300 font-bold leading-snug transition-colors">"{currentQuery}"</p>}
              </div>
              <div className="flex-1 pb-4">
                <AgentResult result={result} isLoading={isLoading} error={error} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-5 transition-colors">
              <div className="w-24 h-24 rounded-full bg-white/50 dark:bg-slate-800/50 flex items-center justify-center shadow-inner border border-white/60 dark:border-white/5">
                <Globe size={40} className="text-indigo-300 dark:text-indigo-500 opacity-60" />
              </div>
              <p className="font-semibold text-lg text-slate-500 dark:text-slate-400">Awaiting your question...</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
