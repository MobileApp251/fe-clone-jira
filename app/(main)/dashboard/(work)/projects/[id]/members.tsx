import MemberCard from "@/components/card/MemberCard";
import AddMemberModal from "@/components/project/AddMember";
import SearchBar from "@/components/search/SearchBar";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronsLeft, UserPlus } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { projects } from "../project_data";

export default function ProjectMembers() {
    const [openAddMember, setOpenAddMember] = useState(false);
    const { id } = useLocalSearchParams<{ id: string }>();
    const project = projects.find((p) => p.id === id);
    
    if (!project) {
        return (
            <Box className="flex-1 justify-center items-center">
                <Text>Project not found</Text>
            </Box>
        );
    }

    return (
        <Box className="flex-1">
            <Pressable className="flex-row items-center px-6" onPress={() => router.back()}>
                <ChevronsLeft size={18} color={Colors.light.primary}/>
                <Text className="ml-1 text-lightPrimary font-medium">Back</Text>
            </Pressable>

            <Box className="flex-row items-center justify-between mb-4 px-6">
                <Text className="text-3xl font-semibold text-darkTextPrimary">{project.title}</Text>

                <Pressable 
                    onPress={() => setOpenAddMember(true)}
                    className="flex-row items-center px-3 py-2 border border-lightPrimary rounded-lg"
                >
                    <UserPlus size={18} color={Colors.light.primary} />
                    <Text className="ml-2 text-lightPrimary font-medium">
                        Add member
                    </Text>
                </Pressable>
            </Box>

            <SearchBar page='onlySearch'/>
            <Box className="mt-4 mx-6">
                {[
                    { id: "1", name: "Nguyễn Văn A" },
                    { id: "2", name: "Nguyễn Văn B" },
                    { id: "3", name: "Nguyễn Văn C" },
                ].map((member) => (
                <MemberCard
                    key={member.id}
                    id={member.id}
                    name={member.name}
                    onRemove={(id) => {
                    console.log("Remove member:", id);
                    }}
                />
                ))}
            </Box>
            <AddMemberModal
                visible={openAddMember}
                onClose={() => setOpenAddMember(false)}
            />
        </Box>
    );
}
