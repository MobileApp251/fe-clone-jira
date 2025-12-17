import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Modal, Pressable } from "react-native";

interface SortPanelProps {
    visible: boolean;
    onClose: () => void;
    onSelect?: (value: string) => void;
}

export default function SortPanel({
    visible,
    onClose,
    onSelect,
}: SortPanelProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Overlay */}
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* Panel */}
                <Pressable
                    onPress={() => { }}
                    style={{
                        width: "85%",
                        backgroundColor: "white",
                        borderRadius: 12,
                        padding: 16,
                    }}
                >
                    <Text className="text-lg font-semibold mb-4 text-darkTextPrimary">
                        Sort by
                    </Text>

                    {/* Options */}
                    {["Created date", "Due date", "Priority"].map((item) => (
                        <Pressable
                            key={item}
                            onPress={() => {
                                onSelect?.(item);
                                onClose();
                            }}
                            className="py-3"
                        >
                            <Text className="text-base text-darkTextPrimary">{item}</Text>
                        </Pressable>
                    ))}

                    {/* Actions */}
                    <Box className="flex-row justify-end mt-4">
                        <Pressable onPress={onClose} className="px-3 py-2">
                            <Text className="text-lightPrimary">Cancel</Text>
                        </Pressable>
                    </Box>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
