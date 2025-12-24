import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { usePathname, useRouter } from "expo-router";
import { Pressable } from "react-native";

const WorkSwitch = () => {
    const router = useRouter();
    const pathname = usePathname();

    const isProjects = pathname.endsWith("/projects");
    const isTasks = pathname.endsWith("/tasks");

    const Tab = ({
        label,
        active,
        onPress,
    }: {
        label: string;
        active: boolean;
        onPress: () => void;
    }) => (
        <Pressable onPress={onPress} style={{ flex: 1 }}>
            <Box className={`flex-1 items-center justify-center overflow-hidden rounded-lg ${active ? "bg-white" : "bg-transparent"} `}>
                <Text className={active ? "text-black font-medium" : "text-gray-400"}>
                    {label}
                </Text>
            </Box>
        </Pressable>
    );

    return (
        <Box className="bg-lightPrimaryLight items-center mx-6 p-2 rounded-xl">
            <HStack space="sm" reversed={false}>
                <Box className="flex-1 h-12 rounded-lg overflow-hidden">
                    <Tab
                        label="My projects"
                        active={isProjects}
                        onPress={() => router.push("/dashboard/projects")}
                    />
                </Box>
                <Box className="flex-1 h-12 rounded-lg overflow-hidden">
                    <Tab
                        label="My tasks"
                        active={isTasks}
                        onPress={() => router.push("/dashboard/tasks")}
                    />
                </Box>
            </HStack>
        </Box>
    );
};

export default WorkSwitch;
