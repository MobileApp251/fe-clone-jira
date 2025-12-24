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
    const { projects, loading, error, loadProjects } = useProjects();
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    const filteredTasks = useMemo(() => {
        if (!search.trim()) return projects;

        const q = search.toLowerCase();

        return projects.filter(
            (t) =>
                t.proj_name.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q)
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
            ) : filteredTasks.length === 0 ? (
                <Box className="flex-1 justify-center items-center">
                    <Text className="text-darkTextSecondary text-sm">
                        No matching projects
                    </Text>
                </Box>
            ) : (
                <FlatList
                    className="mt-4"
                    data={projects}
                    keyExtractor={(item) => item.proj_id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => router.push(`/dashboard/projects/${item.proj_id}`)}
                        >
                            <ProjectCard
                                title={item.proj_name}
                                description={item.description}
                                members={4}
                                status={getProjectStatus({
                                    startAt: item.startAt ? dayjs(item.startAt).toISOString() : "",
                                    endAt: item.endAt ? dayjs(item.endAt).toISOString() : "",
                                    isDone: item.done,
                                })}
                                endDate={formatDate(item.endAt)}
                            />
                        </Pressable>
                    )}
                />
            )}
        </Box>
    );
}
