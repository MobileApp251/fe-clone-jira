import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable } from "react-native";

export default function DatePickerField({label}:{label: string;}) {
	const [date, setDate] = useState<Date | null>(null);
	const [show, setShow] = useState(false);

	return (
		<Box className="relative mb-5">
			<Box className="absolute left-3 -top-2 px-1 z-10 bg-lightPrimaryLight">
				<Text className="text-xs font-semibold text-blue-700">
					{label}
				</Text>
			</Box>

			<Pressable
				onPress={() => setShow(true)}
				className="border border-lightPrimary rounded-lg px-3 py-3 flex-row items-center justify-between"
			>
				<Text className="text-lightPrimary">
				{date ? date.toLocaleDateString("en-US") : "MM/DD/YYYY"}
				</Text>
				<Calendar size={18} color={Colors.light.primary} />
			</Pressable>

			{show && (
				<DateTimePicker
				value={date ?? new Date()}
				mode="date"
				display={Platform.OS === "ios" ? "inline" : "default"}
				onChange={(e, selectedDate) => {
					setShow(false);
					if (selectedDate) setDate(selectedDate);
				}}
				/>
			)}
		</Box>
  );
}