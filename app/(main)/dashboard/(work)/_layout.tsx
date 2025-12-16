
import WorkSwitch from "@/components/header/WorkSwitch";
import { Box } from "@/components/ui/box";
import { Slot } from "expo-router";

export default function WorkLayout() {
    return (
        <Box>
            <WorkSwitch/>
            <Box className="py-4">
                <Slot />
            </Box>
        </Box>
    );
}
