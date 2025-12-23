import { getMyProjects } from "@/api/projects";
import { ProjectAPIResponse } from "@/utils/workType";
import { createContext, useCallback, useContext, useState } from "react";

type ProjectsContextType = {
    projects: ProjectAPIResponse[];
    loading: boolean;
    error: string | null;
    loadProjects: (force?: boolean) => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<ProjectAPIResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProjects = useCallback(async (force = false) => {
        if (!force && projects.length > 0) return;

        try {
            setLoading(true);
            setError(null);

            const data = await getMyProjects();
            setProjects(data);
        } catch (err: any) {
            setError(err?.message ?? "LOAD_FAILED");
        } finally {
            setLoading(false);
        }
    }, [projects.length]);

    return (
        <ProjectsContext.Provider value={{ projects, loading, error, loadProjects }}>
            {children}
        </ProjectsContext.Provider>
        
    );
}

export function useProjects() {
    const ctx = useContext(ProjectsContext);
    if (!ctx) {
        throw new Error("useProjects must be used inside ProjectsProvider");
    }
    return ctx;
}
