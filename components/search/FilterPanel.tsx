import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { DateType } from "react-native-ui-datepicker";
import DatePickerField from "../datepicker/DatePickerField";

export default function ProjectFilter() {

    const [startDate, setStartDate] = useState<DateType>();
    const [endDate, setEndDate] = useState<DateType>();

    return (
        <Box className="bg-lightPrimaryLight rounded-xl pt-4 pl-4 pr-4 mt-4">
            <Box className="mb-4">
                <Box className="bg-blue-500 rounded-lg px-4 py-2 w-32">
                    <Text className="text-white font-medium">Status</Text>
                </Box>
            </Box>

            <DatePickerField date={startDate} setDate={setStartDate} maxDate={endDate} label="Start Date" />
            <DatePickerField date={endDate} setDate={setEndDate} minDate={startDate} label="End Date" />
        </Box>
    )
}
