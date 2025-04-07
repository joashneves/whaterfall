import { View, Text, StyleSheet } from "react-native";


export default function HudPage(){
  return (
    <View style={styles.container}>
      <Text>Hud Page</Text>
      <Text>This is the Hud Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {  
    display: "flex",
    flexDirection: "row",
    color: "#fff",
    backgroundColor: "#fff",
    height: 24,
    width:'100%'
  },
  text: {
    fontSize: 20,
    color: "#fff",
  },
});