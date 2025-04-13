import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import socket from '../../../utils/socket';

export default function Chat() {
  const [mensagem, setMensagem] = useState("text");
  //console.log(socket);

      const onConnect = () => {
        console.log("Conectado ao socket");
      };
  
      // Listener para receber mensagens atualizadas
      const onAtualizarMensagem = (novaMensagem: string) => {
        console.log("Nova mensagem recebida:", novaMensagem);
        setMensagem(novaMensagem);
      };
  
      socket.on("connect", onConnect);
      socket.on("atualizar_mensagem", onAtualizarMensagem);

      socket.on("disconnect", () => {
        console.log("Desconectado do socket");
      });
    
  
    function sendMessage(text: string) {
      setMensagem(text);
      // Emitir a mensagem para o servidor
      if (__DEV__) {
        console.log(text);
      }
      socket.emit("enviar_mensagem", text);
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
