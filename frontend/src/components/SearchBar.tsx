import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';

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
        <div className="relative flex items-center w-full">
            <div className="absolute left-4 text-gray-400">
                <Search size={20} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="e.g., What is the population of India?"
                className="w-full bg-gray-800/80 text-gray-100 placeholder-gray-500 rounded-xl border border-gray-700 shadow-inner pl-12 pr-40 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50 text-lg font-medium"
            />
            <button
                onClick={handleInvoke}
                disabled={!query.trim() || isLoading}
                className="absolute right-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Running
                    </>
                ) : (
                    "Run Agent"
                )}
            </button>
        </div>
    );
}
