
import WorkSwitch from "@/components/header/WorkSwitch";
import { Box } from "@/components/ui/box";
import { Stack, usePathname } from "expo-router";

export default function WorkLayout() {
    const pathName = usePathname();
    const showSwitch = pathName.endsWith("projects") || pathName.endsWith("tasks")
    return (
        <Box className="flex-1">
            {showSwitch && <WorkSwitch />}
            <Box className="py-4 flex-1">
                <Stack screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'white' }
                }} />
            </Box>
        </Box>
    );
}
