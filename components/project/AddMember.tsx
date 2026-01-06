import { addMembers } from "@/api/projects";
import { searchUserByEmailPattern } from "@/api/users";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useProjects } from "@/context/ProjectsContext";
import { Plus, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable } from "react-native";
import MemberCard from "../card/MemberCard";
import SearchBar from "../search/SearchBar";
import { Box } from "../ui/box";
import { ButtonSpinner } from "../ui/button";
import { Toast, ToastDescription, ToastTitle, useToast } from "../ui/toast";

type Props = {
    visible: boolean;
    onClose: () => void;
};

type ToastType = "error" | "warning" | "success" | "info" | "muted" | undefined;

export default function AddMemberModal({ visible, onClose }: Props) {
    const [search, setSearch] = useState("")

    const [members, setMembers] = useState<string[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { project, updateMembers } = useProjects();

    const handleSelectMember = (uid: string) => {
        const isInList = selectedMembers.includes(uid);
        if (isInList) {
            setSelectedMembers(prev => prev.filter(id => id !== uid));
        } else {
            setSelectedMembers(prev => [...prev, uid]);
        }
    }

    useEffect(() => {
        if (!search.trim()) {
            setMembers([]);
            return;
        }

        const timeout = setTimeout(() => {
            fetchMembers();
        }, 600);

        return () => clearTimeout(timeout);

        async function fetchMembers() {
            const listEmail = await searchUserByEmailPattern(search);
            setMembers(listEmail);
        }
    }, [search]);

    const handleAddMember = async () => {
        try {
            if (selectedMembers.length <= 0) {
                handleToast("error", "Add member to project!", "No member has been selected.")
                return;
            }
            setLoading(true);
            const results:
                { email: string; success: boolean; data?: any; error?: string }[]
                = await addMembers(project.project.proj_id, selectedMembers);
            updateMembers(project.project.proj_id);
            handleToast("success", "Add member to project!", "New members have been added successfully.")
            onClose();
            setSearch("");
            setMembers([]);
            setSelectedMembers([]);
            onClose();
        } catch (error) {
            console.error(error);
            onClose();

        } finally {
            setLoading(false);
        }
    }

    const toast = useToast();
    const [toastId, setToastId] = useState("0");
    const handleToast = (type: ToastType, title: string, text: string) => {
        if (!toast.isActive(toastId)) {
            showToast(type, title, text);
        }
    };
    const showToast = (type: ToastType, title: string, text: string) => {
        const newId = Math.random().toString();
        setToastId(newId);
        toast.show({
            id: newId,
            placement: 'bottom',
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast nativeID={uniqueToastId} action={type} variant="outline" className="bg-white">
                        <ToastTitle>{title}</ToastTitle>
                        <ToastDescription className="text-darkTextPrimary">
                            {text}
                        </ToastDescription>
                    </Toast>
                );
            },
        });
    };

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center"
                onPress={() => {
                    onClose();
                    setSearch("");
                    setMembers([]);
                    setSelectedMembers([]);
                }}
            >
                <Box className="absolute inset-0 justify-center items-center">
                    <Pressable
                        className="w-[90%] bg-white rounded-2xl pt-4"
                        onPress={() => { }}
                    >
                        <Text className="text-2xl font-semibold mb-4 text-darkTextPrimary px-6">
                            Add member
                        </Text>

                        <SearchBar page='onlySearch' value={search} onChange={setSearch}></SearchBar>

                        <Box className="px-6 pt-4 pb-4">
                            {members.map((member) => (
                                <MemberCard
                                    key={member}
                                    id={member}
                                    name={member}
                                    selected={selectedMembers.includes(member)}
                                    onSelected={() => handleSelectMember(member)}
                                />
                            ))}

                            <Pressable
                                className={`flex-row items-center justify-center py-3 rounded-xl mb-3
                                    ${selectedMembers.length <= 0
                                        ? "bg-lightPrimary/40"
                                        : "bg-lightPrimary"}
                                `}
                                onPress={handleAddMember}
                                disabled={selectedMembers.length <= 0}
                            >
                                {loading ? (<ButtonSpinner color="gray" />) : (<Plus size={18} color="white" />)}
                                <Text className="text-white font-semibold ml-2">
                                    Add new member
                                </Text>
                            </Pressable>

                            <Pressable
                                className="flex-row items-center justify-center border border-indanger py-3 rounded-xl"
                                onPress={() => {
                                    onClose();
                                    setSearch("");
                                    setMembers([]);
                                    setSelectedMembers([]);
                                }}
                            >
                                <X size={18} color={Colors.status.danger} />
                                <Text className="text-indanger font-semibold ml-2">
                                    Cancel
                                </Text>
                            </Pressable>
                        </Box>
                    </Pressable>
                </Box>
            </Pressable>
        </Modal>
    );
}
