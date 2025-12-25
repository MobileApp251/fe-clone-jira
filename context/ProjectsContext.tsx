import { createProject, getMyProjects, getProjectById, getProjectTasks } from "@/api/projects";
import { createTask } from "@/api/tasks";
import { CreateProjectDTO, CreateTaskDTO, ProjectByIdAPIResponse, ProjectData, TaskAPIResponse } from "@/utils/workType";
import { createContext, useCallback, useContext, useState } from "react";

type ProjectsContextType = {
    projects: ProjectData[];
    project: ProjectByIdAPIResponse;
    projectTasks: TaskAPIResponse[];
    loading: boolean;
    error: string | null;
    createNewProject: (project: CreateProjectDTO) => Promise<ProjectData>;
    createNewTask: (projectId: string, task: CreateTaskDTO) => Promise<void>
    loadProjects: (force?: boolean) => Promise<void>;
    loadProjectById: (id: string) => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [project, setProject] = useState<ProjectByIdAPIResponse>({
        members: [],
        project: {
            createAt: "",
            description: "",
            endAt: "",
            proj_id: "",
            proj_name: "",
            startAt: "",
            updateAt: "",
            done: false,
        }
    })
    const [projectTasks, setProjectTasks] = useState<TaskAPIResponse[]>([]);

    const createNewProject = useCallback(async (project: CreateProjectDTO) => {
        try {
            setLoading(true);
            setError(null);

            const newProject = await createProject(project);
            setProjects(prev => [...prev, newProject]);
            return newProject;
        } catch (error: any) {
            setError(error?.message ?? "LOAD_FAILED");
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

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

    const loadProjectById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getProjectById(id);
            setProject(data);
            const projectTasks = await getProjectTasks(id);
            setProjectTasks(projectTasks);
        } catch (error: any) {
            setError(error?.message ?? "LOAD_FAILED");
        } finally {
            setLoading(false);
        }
    }, [])

    const createNewTask = useCallback(async (projectId: string, task: CreateTaskDTO) => {
        try {
            setLoading(true);
            setError(null);

            const data = await createTask(projectId, task);
            setProjectTasks(prev => [...prev, data]);
        } catch (error: any) {
            setError(error?.message ?? "LOAD_FAILED");
        } finally {
            setLoading(false);
        }
    }, [])

    return (
        <ProjectsContext.Provider value={{ projects, project, projectTasks, loading, error, createNewProject, loadProjects, loadProjectById, createNewTask}}>
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
