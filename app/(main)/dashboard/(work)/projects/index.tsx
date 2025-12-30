import ProjectCard from "@/components/card/ProjectCard";
import CreateProjectModal from "@/components/project/Create";
import ProjectFilter from "@/components/search/FilterPanel";
import SearchBar from "@/components/search/SearchBar";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useProjects } from "@/context/ProjectsContext";
import { formatDate } from "@/utils/date";
import { getProjectStatus } from "@/utils/projectStatus";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable } from "react-native";

export default function ProjectsScreen() {
    const [showFilter, setShowFilter] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { projects, loading, loadProjects } = useProjects();
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    const filteredProjects = useMemo(() => {
        if (!search.trim()) return projects;

        const q = search.toLowerCase();

        return projects.filter(
            (t) =>
                t.project.proj_name.toLowerCase().includes(q) ||
                t.project.description?.toLowerCase().includes(q)
        );
    }, [projects, search]);

    return (
        <Box className="flex-1">
            <SearchBar
                page="project"
                onCreatePress={() => setShowCreateModal((prev) => !prev)}
                onFilterPress={() => setShowFilter((prev) => !prev)}
                value={search}
                onChange={setSearch} />

            <CreateProjectModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />

            <Box className="ml-6 mr-6">
                {showFilter && <ProjectFilter />}
            </Box>

            {loading ? (
                <Box className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </Box>
            ) : filteredProjects.length === 0 ? (
                <Box className="flex-1 justify-center items-center">
                    <Text className="text-darkTextSecondary text-sm">
                        No matching projects
                    </Text>
                </Box>
            ) : (
                <FlatList
                    className="mt-4"
                    data={filteredProjects}
                    keyExtractor={(item) => item.project.proj_id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => router.push(`/dashboard/projects/${item.project.proj_id}`)}
                            key={item.project.proj_id}
                        >
                            <ProjectCard
                                projectId={item.project.proj_id}
                                title={item.project.proj_name}
                                description={item.project.description}
                                members={item.members.length}
                                status={getProjectStatus({
                                    startAt: item.project.startAt ? dayjs(item.project.startAt).toISOString() : "",
                                    endAt: item.project.endAt ? dayjs(item.project.endAt).toISOString() : "",
                                    isDone: item.project.done,
                                })}
                                endDate={formatDate(item.project.endAt)}
                            />
                        </Pressable>
                    )}
                />
            )}
        </Box>
    );
}
