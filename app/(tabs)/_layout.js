import { Tabs } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import DynamicBottomTab from "../../components/DynamicBottomTab";

export default function TabsLayout() {
  const { Colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <DynamicBottomTab {...props} />}
    />
  );
}
