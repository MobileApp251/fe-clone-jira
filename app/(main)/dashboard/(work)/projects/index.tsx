import ProjectCard from "@/components/card/ProjectCard";
import CreateProjectModal from "@/components/project/Create";
import ProjectFilter from "@/components/search/FilterPanel";
import SearchBar from "@/components/search/SearchBar";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable } from "react-native";
import { projects } from "./project_data";

export default function ProjectsScreen() {

    const [showFilter, setShowFilter] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    
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
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/(main)/dashboard/(work)/projects/${item.id}`)}
                        >
                        <ProjectCard
                            title={item.title}
                            description={item.description}
                            members={item.members}
                            status={item.status}
                            endDate={item.endDate}
                        />
                    </Pressable>
                )}
            />
        </Box>
    );
}
