import { Bot, AlertTriangle } from 'lucide-react';

interface AgentResultProps {
    result: string | null;
    isLoading: boolean;
    error: string | null;
}

export function AgentResult({ result, isLoading, error }: AgentResultProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg animate-pulse">
                    <Bot size={32} className="text-white" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-emerald-400">Agent is thinking...</h3>
                    <p className="text-sm text-gray-500">Checking the REST Countries API & synthesizing an answer.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex gap-4 p-6 bg-red-950/30 border border-red-900/50 rounded-xl">
                <div className="text-red-500 shrink-0">
                    <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-400 mb-1">Execution Failed</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{error}</p>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="flex gap-5">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md">
                    <Bot size={20} className="text-white" />
                </div>
                <div className="flex-1 pt-1">
                    <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                        {result}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
