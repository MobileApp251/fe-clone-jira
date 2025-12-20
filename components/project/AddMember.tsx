import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { Plus, X } from "lucide-react-native";
import { Modal, Pressable } from "react-native";
import MemberCard from "../card/MemberCard";
import SearchBar from "../search/SearchBar";
import { Box } from "../ui/box";

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function AddMemberModal({ visible, onClose }: Props) {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center"
                onPress={onClose}
            >
                <Pressable
                    className="w-[90%] bg-white rounded-2xl pt-4"
                    onPress={() => {}}
                >
                <Text className="text-2xl font-semibold mb-4 text-darkTextPrimary px-6">
                    Add member
                </Text>

                <SearchBar page='onlySearch'></SearchBar>

                <Box className="px-6 pt-4 pb-4">
                    <MemberCard id="5" name="Nguyễn Văn E"/>

                    <Pressable className="flex-row items-center justify-center bg-lightPrimary py-3 rounded-xl mb-3">
                        <Plus size={18} color="white" />
                        <Text className="text-white font-semibold ml-2">
                        Add new member
                        </Text>
                    </Pressable>

                    <Pressable
                        className="flex-row items-center justify-center border border-indanger py-3 rounded-xl"
                        onPress={onClose}
                    >
                        <X size={18} color={Colors.status.danger} />
                        <Text className="text-indanger font-semibold ml-2">
                            Cancel
                        </Text>
                    </Pressable>
                </Box>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
