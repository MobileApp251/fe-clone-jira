import WorkSwitch from "@/components/header/WorkSwitch";
import { Redirect, usePathname } from "expo-router";
import { View } from "react-native";

export default function Dashboard() {
    const pathname = usePathname();

    if (pathname.endsWith("/dashboard")) {
        return (
            <>
                <WorkSwitch />
                <Redirect href="/(main)/dashboard/(work)/projects" />
            </>
        );
    }

    return (
        <View className="flex-1">
            <WorkSwitch />
        </View>
    );
}
