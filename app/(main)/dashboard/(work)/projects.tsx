import ProjectCard from "@/components/card/ProjectCard";
import CreateProjectModal from "@/components/project/Create";
import ProjectFilter from "@/components/search/FilterPanel";
import SearchBar from "@/components/search/SearchBar";
import { Box } from "@/components/ui/box";
import { useState } from "react";
import { FlatList } from "react-native";
import { projects } from "./project_data";

export default function ProjectsScreen() {
    const [showFilter, setShowFilter] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    return (
        <Box className="flex-1">
            <SearchBar 
                onCreatePress={() => setShowCreateModal((prev) => !prev)}
                onFilterPress={() => setShowFilter((prev) => !prev)}/>
            
            <CreateProjectModal 
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
            {showFilter && <ProjectFilter />}

            <FlatList
                className="mt-4"
                data={projects}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProjectCard
                        title={item.title}
                        description={item.description}
                        members={item.members}
                        status={item.status}
                        endDate={item.endDate}
                    />
                )}
            />
        </Box>
    );
}
