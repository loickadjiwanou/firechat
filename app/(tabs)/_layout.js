import { Tabs, usePathname } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import DynamicBottomTab from "../../components/DynamicBottomTab";
import FloatingBottomTab from "../../components/FloatingBottomTab";
import UserBar from "../../components/UserBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { top, bottom } = useSafeAreaInsets();
  const pathName = usePathname();
  const { Colors } = useTheme();

  console.log("path name", pathName);

  const pathsData = {
    chats: {
      nb: 12,
    },
    groups: {
      nb: 20,
    },
    calls: {
      nb: 18,
    },
    settings: {
      nb: 0,
    },
  };

  return (
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
      //   tabBar={(props) => <DynamicBottomTab {...props} />}
      tabBar={() => <FloatingBottomTab />}
    />
  );
}
