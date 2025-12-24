
import { Box } from "@/components/ui/box";
import { Stack } from "expo-router";

export default function ProjectsLayout() {
    return (
        <Box className="flex-1">
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'white' }
            }} />
        </Box>
    );
}
