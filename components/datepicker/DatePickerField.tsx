import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import DatePicker, { DateType, useDefaultClassNames } from 'react-native-ui-datepicker';

export default function DatePickerField({ label }: { label: string; }) {
	const [date, setDate] = useState<DateType>();
	const [show, setShow] = useState(false);
	const [tempDate, setTempDate] = useState<DateType>();

	const defaultClassNames = useDefaultClassNames();

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
					{date ? date.toLocaleString("en-US").split(",")[0] : "MM/DD/YYYY"}
				</Text>
				<Calendar size={18} color={Colors.light.primary} />
			</Pressable>

			{show && (
				<Modal
					visible={show}
					transparent
					animationType="fade"
					onRequestClose={() => setShow(false)}
				>
					<Pressable
						onPress={() => setShow(false)}
						style={{
							flex: 1,
							backgroundColor: "rgba(0,0,0,0.3)",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Pressable
							onPress={() => { }}
							style={{
								backgroundColor: "white",
								borderRadius: 12,
								padding: 12,
								width: "90%",
							}}
						>
							<DatePicker
								mode="single"
								date={tempDate}
								onChange={({ date }) => {
									setTempDate(date);
								}}
								navigationPosition="right"
								classNames={{
									...defaultClassNames,
									today: "bg-lightPrimary/20",
									today_label: "text-lightPrimary",
									selected: "bg-lightPrimary border-lightPrimary",
									selected_label: "text-white",
									day_label: "text-lightPrimary",
									day: `${defaultClassNames.day} hover:bg-amber-100`,
									disabled: "opacity-50",
									button_next: "bg-lightPrimary rounded-md p-8",
									button_prev: "bg-lightPrimary rounded-md p-8",
								}}
							/>
							<View
								className="flex-row justify-end mt-0"
							>
								<Pressable
									onPress={() => setShow(false)}
									className="p-4"
								>
									<Text className="text-lightPrimary font-bold">
										Cancel
									</Text>
								</Pressable>

								<Pressable
									onPress={() => {
										setDate(tempDate);
										setShow(false);
									}}
									className="p-4"
								>
									<Text className="text-lightPrimary font-bold">
										OK
									</Text>
								</Pressable>
							</View>
						</Pressable>
					</Pressable>
				</Modal>
			)}
		</Box>
	);
}