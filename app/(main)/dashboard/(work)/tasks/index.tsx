import TaskCard from "@/components/card/TaskCard";
import SearchBar from "@/components/search/SearchBar";
import SortPanel from "@/components/search/SortPannel";
import { Box } from "@/components/ui/box";
import { useState } from "react";
import { FlatList } from "react-native";
import { tasks } from "./task_data";

export default function TasksScreen() {
    const [showFilter, setShowFilter] = useState(false);

    return (
        <Box className="flex-1">
            <SearchBar page="task" onFilterPress={() => setShowFilter((prev) => !prev)} />
            <SortPanel
                visible={showFilter}
                onClose={() => setShowFilter(false)}
                onSelect={(value) => {
                    console.log("Sort by:", value);
                }}
            />
            <FlatList
                className="mt-4"
                data={tasks}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TaskCard
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        priority={item.priority}
                        status={item.status}
                        endDate={item.endDate}
                    />
                )}
            />
        </Box>
    );
}
