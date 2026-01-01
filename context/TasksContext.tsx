import { getMyTasks } from "@/api/tasks";
import { TaskData } from "@/utils/workType";
import { createContext, useCallback, useContext, useState } from "react";

type TasksContextType = {
    tasks: TaskData[];
    loading: boolean;
    error: string | null;
    loadTasks: (force?: boolean) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loadTasks = useCallback(async (force = false) => {
        if (!force && tasks.length > 0) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getMyTasks();
            setTasks(data);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [tasks.length]);

    return (
        <TasksContext.Provider value={{ tasks, loading, error, loadTasks }}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    const ctx = useContext(TasksContext);
    if (!ctx) {
        throw new Error("useContext must be used inside TasksProvider");
    }
    return ctx;
}