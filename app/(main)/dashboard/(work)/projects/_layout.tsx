
import { Box } from "@/components/ui/box";
import { Slot } from "expo-router";

export default function ProjectsLayout() {
    return (
        <Box className="flex-1">
            <Slot/>
        </Box>
    );
}
