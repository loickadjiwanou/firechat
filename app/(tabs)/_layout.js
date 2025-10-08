import { Tabs, usePathname, router } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import FloatingBottomTab from "../../components/FloatingBottomTab";
import UserBar from "../../components/UserBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingButton from "../../components/FloatingButton";

export default function TabsLayout() {
  const { top, bottom } = useSafeAreaInsets();
  const pathName = usePathname();
  const { Colors } = useTheme();

  const pathsData = {
    chats: { nb: 12 },
    groups: { nb: 20 },
    calls: { nb: 18 },
    settings: { nb: 0 },
  };

  const pressFloatingButton = () => {
    if (pathName?.slice(1) == "chats") {
      router.push("/contacts");
    }
    if (pathName?.slice(1) == "groups") {
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
                path={pathName.slice(1)}
                pathData={pathsData[pathName.slice(1)]}
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

      {pathName.slice(1) !== "settings" && pathName.slice(1) !== "calls" && (
        <FloatingButton
          from={pathName.slice(1)}
          icon={"plus"}
          text={
            pathName.slice(1) === "chats"
              ? "New Chat"
              : pathName.slice(1) === "groups"
              ? "New Group"
              : "Add"
          }
          onPress={() => pressFloatingButton()}
        />
      )}
    </>
  );
}
