import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable } from "react-native";

export default function DatePickerField({label}:{label?: string;}) {
	const [date, setDate] = useState<Date | null>(null);
	const [show, setShow] = useState(false);
	const [tempDate, setTempDate] = useState<DateType>();

	const defaultClassNames = useDefaultClassNames();

	return (
		<Box className="relative mb-5">
			{label && <Box className="absolute left-3 -top-2 px-1 z-10 bg-lightPrimaryLight">
				<Text className="text-xs font-semibold text-blue-700">
					{label}
				</Text>
			</Box>}
			

			<Pressable
				onPress={() => setShow(true)}
				className="border border-inputBorder rounded-lg px-3 py-3 flex-row items-center justify-between"
			>
				<Text className="text-lightPrimary">
					{date ? date.toLocaleString("en-US").split(",")[0] : "MM/DD/YYYY"}
				</Text>
				<Calendar size={18} color={Colors.light.primary} />
			</Pressable>

			{show && (
				<DateTimePicker
				value={date ?? new Date()}
				mode="date"
				display={Platform.OS === "ios" ? "compact" : "default"}
				onChange={(e, selectedDate) => {
					setShow(false);
					if (selectedDate) setDate(selectedDate);
				}}
				/>
			)}
		</Box>
	);
}