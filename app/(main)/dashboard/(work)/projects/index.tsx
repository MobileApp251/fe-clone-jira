import ProjectCard from "@/components/card/ProjectCard";
import CreateProjectModal from "@/components/project/Create";
import ProjectFilter from "@/components/search/FilterPanel";
import SearchBar from "@/components/search/SearchBar";
import { Box } from "@/components/ui/box";
import { useProjects } from "@/context/ProjectsContext";
import { formatDate } from "@/utils/date";
import { getProjectStatus } from "@/utils/projectStatus";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";

export default function ProjectsScreen() {
    const [showFilter, setShowFilter] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { projects, loading, error, loadProjects } = useProjects();
    
    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <Box className="flex-1">
            <SearchBar
                page="project"
                onCreatePress={() => setShowCreateModal((prev) => !prev)}
                onFilterPress={() => setShowFilter((prev) => !prev)}/>
            
            <CreateProjectModal 
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />

            <Box className="ml-6 mr-6">
                {showFilter && <ProjectFilter />}
            </Box>
            

            <FlatList
                className="mt-4"
                data={projects}
                keyExtractor={(item) => item.proj_id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/(main)/dashboard/(work)/projects/${item.proj_id}`)}
                        >
                        <ProjectCard
                            title={item.proj_name}
                            description={item.description}
                            members={4}
                            status={getProjectStatus({
                                startAt: item.startAt,
                                endAt: item.endAt,
                                isDone: true,
                            })}
                            endDate={formatDate(item.endAt)}
                        />
                    </Pressable>
                )}
            />
        </Box>
    );
}
