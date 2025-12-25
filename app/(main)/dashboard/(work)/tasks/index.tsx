import TaskCard from "@/components/card/TaskCard";
import SearchBar from "@/components/search/SearchBar";
import SortPanel from "@/components/search/SortPannel";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useTasks } from "@/context/TasksContext";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";

export default function TasksScreen() {
    const [showFilter, setShowFilter] = useState(false);
    const [search, setSearch] = useState("");
    const { tasks, loading, loadTasks } = useTasks();

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const filteredTasks = useMemo(() => {
        if (!search.trim()) return tasks;

        const q = search.toLowerCase();

        return tasks.filter(
            (t) =>
                t.task_name.toLowerCase().includes(q) ||
                t.content?.toLowerCase().includes(q)
        );
    }, [tasks, search]);

    return (
        <Box className="flex-1">
            <SearchBar
                page="task"
                onFilterPress={() => setShowFilter((prev) => !prev)}
                value={search}
                onChange={setSearch} />
            <SortPanel
                visible={showFilter}
                onClose={() => setShowFilter(false)}
                onSelect={(value) => {
                    console.log("Sort by:", value);
                }}
            />
            {loading ? (
                <Box className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </Box>
            ) : filteredTasks.length === 0 ? (
                <Box className="flex-1 justify-center items-center">
                    <Text className="text-darkTextSecondary text-sm">
                        No matching tasks
                    </Text>
                </Box>
            ) : (
                <FlatList
                    className="mt-4"
                    data={filteredTasks}
                    keyExtractor={(item) => item.task_id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TaskCard
                            id={item.task_id}
                            title={item.task_name}
                            description={item.content}
                            status={item.status.toUpperCase()}
                            endDate={new Date(item.endAt)}
                            priority={item.priority}
                            projectId={item.proj_id}
                        />
                    )}
                />
            )}
        </Box>
    );
}
