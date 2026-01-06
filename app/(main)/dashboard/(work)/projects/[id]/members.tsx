import MemberCard from "@/components/card/MemberCard";
import AddMemberModal from "@/components/project/AddMember";
import SearchBar from "@/components/search/SearchBar";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { ProjectMembers as ProjectMembersType } from "@/utils/workType";
import { router } from "expo-router";
import { ChevronsLeft, UserPlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function ProjectMembers() {
    const [openAddMember, setOpenAddMember] = useState(false);
    const [search, setSearch] = useState("")
    const [members, setMembers] = useState<ProjectMembersType[]>([]);
    const { project, updateMembers } = useProjects();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (!project) {
        return (
            <Box className="flex-1 justify-center items-center">
                <Text>Project not found</Text>
            </Box>
        );
    }

    useEffect(() => {
        if (project) {
            setMembers(project.members);
        }
    }, [project]);

    useEffect(() => {
        setMembers(project.members.filter(member => member.email.includes(search)));
    }, [search]);

    return (
        <Box className="flex-1">
            <Pressable className="flex-row items-center px-6" onPress={() => router.back()}>
                <ChevronsLeft size={18} color={Colors.light.primary} />
                <Text className="ml-1 text-lightPrimary font-medium">Back</Text>
            </Pressable>

            <Box className="flex-col items-center justify-between mb-4 px-6">
                <Text className="text-3xl font-semibold text-darkTextPrimary">{project.project.proj_name}</Text>
            </Box>

            <SearchBar page='onlySearch' value={search} onChange={setSearch} />
            <Box className="mt-4 mx-6">
                {members.map((member) => (
                    <MemberCard
                        key={member.uid}
                        id={member.uid}
                        name={member.email}
                        role={member.role}
                    />
                ))}
            </Box>

            <Box className="flex-col items-center justify-between mb-4 px-6">
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

            <AddMemberModal
                visible={openAddMember}
                onClose={() => {
                    setOpenAddMember(false);
                }}
            />
        </Box>
    );
}
