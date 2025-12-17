import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import DatePickerField from "../datepicker/DatePickerField";

export default function ProjectFilter() {
return (
    <Box className="bg-lightPrimaryLight rounded-xl pt-4 pl-4 pr-4 mt-4">
        <Box className="mb-4">
            <Box className="bg-blue-500 rounded-lg px-4 py-2 w-32">
            <Text className="text-white font-medium">Status</Text>
            </Box>
        </Box>

        <DatePickerField label="Start Date"/>
        <DatePickerField label="End Date"/>
    </Box>
)}
