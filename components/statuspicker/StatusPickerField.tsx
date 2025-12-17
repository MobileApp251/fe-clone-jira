import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";

const STATUSES = ["In Progress", "Up Comming", "Due", "Done"];

type Props = {
    value?: string;
    onChange?: (value: string) => void;
};

export default function StatusPickerField({ value, onChange }: Props) {
    const [visible, setVisible] = useState(false);

    return (
    <>
        <Pressable
            onPress={() => setVisible(true)}
            className="border border-inputBorder rounded-lg px-3 py-3 flex-row items-center justify-between"
        >
            <Text className={value ? "text-darkTextPrimary" : "text-gray-400"}>
            {value ?? "Select status"}
            </Text>
            <ChevronDown color={Colors.light.primary}/>
        </Pressable>

        <Modal transparent animationType="fade" visible={visible}>
            <Pressable
                className="absolute inset-0 bg-black/40"
                onPress={() => setVisible(false)}
            />

            <View className="flex-1 justify-center items-center px-6">
            <View className="bg-white rounded-2xl w-full p-4">
                <Text className="text-lg font-semibold mb-3 text-darkTextPrimary">
                    Select status
                </Text>

                {STATUSES.map((item) => (
                <Pressable
                    key={item}
                    onPress={() => {
                    onChange?.(item);
                    setVisible(false);
                    }}
                    className="flex-row items-center justify-between py-3"
                >
                    <Text className="text-darkTextPrimary">{item}</Text>
                    {value === item && (
                    <Check size={18} color={Colors.light.primary} />
                    )}
                </Pressable>
                ))}
            </View>
            </View>
        </Modal>
    </>
)}
