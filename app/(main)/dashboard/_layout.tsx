import { Box } from "@/components/ui/box";
import { Slot } from "expo-router";

export default function DashboardLayout() {
  return (
    <Box className="flex-1 py-1">
      <Slot />
    </Box>
  );
}
