import { View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function ContactsScreens() {
  const router = useRouter();

  return (
    <View>
      <Text>Contacts</Text>

      <Button
        title="Aller vers détail"
        onPress={() => router.push("/(stack)/details")}
      />
    </View>
  );
}
