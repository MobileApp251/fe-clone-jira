
import WorkSwitch from "@/components/header/WorkSwitch";
import { Box } from "@/components/ui/box";
import { Slot } from "expo-router";

export default function WorkLayout() {
    return (
        <Box className="flex-1">
            <WorkSwitch />
            <Box className="py-4 flex-1">
                <Slot />
            </Box>
        </Box>
    );
}
