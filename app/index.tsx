import { Text, View, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HudPage from "./components/HudPage";
import Chat from "./components/chat";

export default function Index() {
  return (
    <LinearGradient
      colors={['#6C3483', '#7D3C989']}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <View
        style={{
          
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        >
        <HudPage/>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: "#fff"}}>Edit app/index.tsx to edit this screen. </Text>
        <Chat/>
        </View>
      </View>
    </LinearGradient>
  );
}
