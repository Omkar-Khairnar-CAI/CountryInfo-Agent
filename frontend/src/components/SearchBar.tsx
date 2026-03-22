import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleInvoke = () => {
        if (query.trim() && !isLoading) {
            onSearch(query.trim());
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInvoke();
        }
    };

    return (
        <div className="relative group flex items-center w-full">
            <div className="absolute left-5 text-indigo-400 dark:text-indigo-500 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">
                <Search size={22} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Discover any country..."
                className="w-full bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl border-2 border-white/50 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] pl-14 pr-40 py-5 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all disabled:opacity-50 text-lg font-semibold"
            />
            <button
                onClick={handleInvoke}
                disabled={!query.trim() || isLoading}
                className="absolute right-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 transform active:scale-95"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Thinking
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        Search
                    </>
                )}
            </button>
        </div>
    );
}
