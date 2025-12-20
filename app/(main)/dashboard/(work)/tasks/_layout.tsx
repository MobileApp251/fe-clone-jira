
import { Box } from "@/components/ui/box";
import { Slot } from "expo-router";

export default function TasksLayout() {
    return (
        <Box className="flex-1">
            <Slot/>
        </Box>
    );
}
