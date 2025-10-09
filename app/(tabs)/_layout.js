import { Tabs, usePathname, router } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import FloatingBottomTab from "../../components/FloatingBottomTab";
import UserBar from "../../components/UserBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingButton from "../../components/FloatingButton";

export default function TabsLayout() {
  const { top } = useSafeAreaInsets();
  const pathName = usePathname();
  const { Colors } = useTheme();

  // 🔸 Normalisation du path
  const routesMap = {
    chats: "chats",
    contacts: "chats",
    groups: "groups",
    "contacts-groups": "groups",
    calls: "calls",
    settings: "settings",
  };

  const normalizedPath = routesMap[pathName.slice(1)] || pathName.slice(1);

  // 🔸 Données des paths
  const pathsData = {
    chats: { nb: 12 },
    groups: { nb: 20 },
    calls: { nb: 18 },
    settings: { nb: 0 },
  };

  const pressFloatingButton = () => {
    if (normalizedPath === "chats") {
      router.push("/contacts");
    }
    if (normalizedPath === "groups") {
      router.push("/contacts-groups");
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          header: () => (
            <View style={{ height: 100 }}>
              <UserBar
                path={normalizedPath}
                pathData={pathsData[normalizedPath]}
                backgroundColor={Colors.userBarBackground}
                backArrow={false}
                searchIcon={true}
                moreIcon={true}
                onPressSearch={() => console.log("search")}
                onPressMore={() => console.log("more")}
                barStyles={{
                  paddingTop: top,
                  paddingHorizontal: 10,
                  paddingBottom: 10,
                }}
              />
            </View>
          ),
        }}
        tabBar={() => <FloatingBottomTab />}
      />

      {normalizedPath !== "settings" && normalizedPath !== "calls" && (
        <FloatingButton
          from={normalizedPath}
          icon={"plus"}
          text={
            normalizedPath === "chats"
              ? "New Chat"
              : normalizedPath === "groups"
              ? "New Group"
              : "Add"
          }
          onPress={pressFloatingButton}
        />
      )}
    </>
  );
}
