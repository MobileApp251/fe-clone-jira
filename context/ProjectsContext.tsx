import { createProject, getMyProjects, getProjectById, getProjectTasks } from "@/api/projects";
import { createTask } from "@/api/tasks";
import { CreateProjectDTO, CreateTaskDTO, ProjectByIdAPIResponse, ProjectData, TaskAPIResponse, TaskData } from "@/utils/workType";
import { createContext, useCallback, useContext, useState } from "react";

type ProjectsContextType = {
    projects: ProjectByIdAPIResponse[];
    project: ProjectByIdAPIResponse;
    projectTasks: TaskAPIResponse[];
    loading: boolean;
    error: string | null;
    createNewProject: (project: CreateProjectDTO) => Promise<ProjectData>;
    createNewTask: (projectId: string, task: CreateTaskDTO) => Promise<void>
    loadProjects: (force?: boolean) => Promise<void>;
    loadProjectById: (id: string) => Promise<void>;
    removeProject: (id: string) => void;
    removeTask: (id: string) => void;
    updateProjectById: (projectId: string, project: ProjectData) => void;
    updateProjectTask: (taskId: string, task: TaskData) => void;
    updateMembers: (projectId: string) => void;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<ProjectByIdAPIResponse[]>([]);
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
            setProjects(prev => [...prev, {
                project: newProject,
                members: []
            }]);
            return newProject;
        } catch (error: any) {
            setError(error?.message ?? "LOAD_FAILED");
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeProject = useCallback((projectId: string) => {
        setProjects(prev =>
            prev.filter(p => p.project.proj_id !== projectId)
        );
    }, []);

    const removeTask = useCallback((taskId: string) => {
        setProjectTasks(prev =>
            prev.filter(p => p.task.task_id !== taskId)
        );
    }, []);

    const updateProjectById = useCallback((projectId: string, updatedProject: ProjectData) => {
        setProjects((prev) =>
            prev.map((item) =>
                item.project.proj_id === projectId
                    ? {
                        ...item,
                        project: {
                            ...item.project,
                            ...updatedProject,
                        },
                    }
                    : item
            )
        );
        setProject((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                project: {
                    ...prev.project,
                    ...updatedProject,
                },
            };
        });
    }, []);

    const updateProjectTask = useCallback((taskId: string, updatedTask: TaskData) => {
        setProjectTasks(prev =>
            prev.map(item =>
                item.task.task_id == taskId
                    ? {
                        ...item,
                        task: {
                            ...item.task,
                            ...updatedTask,
                        },
                    }
                    : item
            )
        );
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
    }, [projects]);

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
            setLoading(false);
            setError(null);
            const data = await createTask(projectId, task);
            setProjectTasks(prev => [{
                task: data,
                members: [],
            }, ...prev]);
        } catch (error: any) {
            setError(error?.message ?? "LOAD_FAILED");
        } finally {
            setLoading(false);
        }
    }, [])

    const updateMembers = useCallback((projectId: string) => {
        loadProjectById(projectId);
    }, []);

    return (
        <ProjectsContext.Provider value={{ projects, project, projectTasks, loading, error, createNewProject, removeProject, removeTask, updateProjectById, updateProjectTask, loadProjects, loadProjectById, createNewTask, updateMembers }}>
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
