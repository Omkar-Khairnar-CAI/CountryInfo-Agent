import { Bot, AlertTriangle } from 'lucide-react';

interface AgentResultProps {
    result: string | null;
    isLoading: boolean;
    error: string | null;
}

export function AgentResult({ result, isLoading, error }: AgentResultProps) {
    if (isLoading && !result) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse blur-xl opacity-40"></div>
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                        <Bot size={36} className="text-white" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 transition-colors">Consulting Agent</h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full inline-block transition-colors">Invoking LangGraph Agent</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex gap-4 p-6 bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl shadow-sm transition-colors">
                <div className="text-red-500 dark:text-red-400 shrink-0 bg-red-100 dark:bg-red-950/50 p-2 rounded-xl h-10 w-10 flex items-center justify-center transition-colors">
                    <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold text-red-800 dark:text-red-400 mb-1 transition-colors">Execution Failed</h3>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-medium transition-colors">{error}</p>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="flex gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Bot size={24} className="text-white" />
                </div>
                <div className="flex-1 pt-1.5">
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-indigo-950 dark:prose-strong:text-indigo-300 prose-strong:font-bold whitespace-pre-wrap font-medium text-[1.05rem] transition-colors">
                        {result}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
