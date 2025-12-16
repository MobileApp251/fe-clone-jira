import ProjectCard from "@/components/card/ProjectCard";
import SearchBar from "@/components/search/SearchBar";
import { Box } from "@/components/ui/box";
import { FlatList } from "react-native";
import { projects } from "./project_data";

export default function ProjectsScreen() {
    return (
        <Box className="flex-1">
            <SearchBar></SearchBar>
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
