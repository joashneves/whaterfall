import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import socket from '../../../utils/socket';

export default function Chat() {
  const [mensagem, setMensagem] = useState("text");
  //console.log(socket);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket conectado com ID:", socket.id);
    });
  
    socket.on("connect_error", (err) => {
      console.log("Erro de conexão:", err.message);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  function sendMessage(text: string) {
    setMensagem(text);
    console.log("Emitindo mensagem:", text, "Socket conectado:", socket.connected);
    if (socket.connected) {
      socket.emit("enviar_mensagem", text);
    } else {
      console.log("Socket não está conectado!");
    }
  }
  

  return (
    <>
      <Text style={{ color: "#fff" }}>Ola!</Text>
      <TextInput  
        style={styles.contatiner}
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={(text) => sendMessage(text)}
        value={mensagem}
      />
      <Text style={{ color: "#fff" }}>{mensagem}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  contatiner: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});
