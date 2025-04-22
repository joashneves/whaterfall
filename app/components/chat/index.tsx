import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import socket from '../../../utils/socket';

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isGroup?: boolean;
  groupId?: string;
};

type Group = {
  _id: string;
  name: string;
};

export default function Chat() {
  const [user, setUser] = useState({ _id: '661fabca234123456789abcd', name: 'Fulano' }); // ← TEMPORÁRIO
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    console.log('Socket Status:', socket.connected); // Verifique a conexão do socket
    
    socket.on('connect', () => {
      
      try {
        console.log('Conectado com ID:', socket.id);
        // Simulação: carregar grupos do usuário
        const userGroups = [
          { _id: '661fac341234abcd5678ef90', name: 'Grupo Geral' },
          { _id: '661fac351234abcd5678ef91', name: 'Amigos' }
        ];
  
        setGroups(userGroups);
  
        // Entrar automaticamente no primeiro grupo
        if (userGroups.length > 0) {
          joinGroup(userGroups[0]._id);
        }
      } catch (error) {
        console.error('Erro ao processar a conexão ou grupos:', error);
      }
    });
  
  }, []);
  
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

    const joinGroup = (groupId: string) => {
      setActiveGroup(groupId);
      setMessages([]); // Limpa mensagens ao trocar de grupo
      socket.emit('joinGroups', [groupId]);
      // Listener para novas mensagens de grupo
      socket.on('newGroupMessage', (newMsg: Message) => {
        try {
          console.log('Nova mensagem de grupo recebida:', newMsg); // Verifique se a mensagem de grupo chega corretamente
    
          if (!activeGroup || newMsg.groupId === activeGroup) {
            setMessages(prev => {
              console.log('Mensagens antes de adicionar a nova:', prev); // Verifique o estado atual das mensagens
              return [...prev, newMsg ];
            });
            scrollToBottom();
          }
        } catch (error) {
          console.error('Erro ao processar nova mensagem de grupo:', error);
        }
      });
    
      // Simulação: carregar mensagens do grupo
      const groupMessages: Message[] = [
        {
          id: '1',
          text: 'Bem-vindo ao grupo!',
          sender: 'Sistema',
          timestamp: new Date(),
          isGroup: true,
          groupId
        }
      ];
      setMessages(groupMessages);
    };

  const sendMessage = () => {
    if (message.trim() === '' || !activeGroup) return;

    const newMessage = {
      groupId: activeGroup,
      senderId: user._id, 
      content: message,
    };

    // Enviar mensagem de grupo via socket
    socket.emit('groupMessage', newMessage);

    // Atualização otimista - mostra a mensagem antes da confirmação
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: message,
      sender: newMessage.senderId === user._id ? 'Você' : 'Desconhecido',
      timestamp: new Date(),
      isGroup: true,
      groupId: activeGroup
    }]);

    setMessage('');
    scrollToBottom();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'Você' ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={styles.senderText}>
        {item.sender === 'Você' ? 'Você' : item.sender}
      </Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Seletor de Grupos */}
      <View style={styles.groupSelector}>
        {groups.map(group => (
          <Text
            key={group._id}
            style={[
              styles.groupButton,
              activeGroup === group._id && styles.activeGroup
            ]}
            onPress={() => joinGroup(group._id)}
          >
            {group.name}
          </Text>
        ))}
      </View>

      {/* Área de Mensagens */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            multiline
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <Text 
            style={styles.sendButton} 
            onPress={sendMessage}
          >
            Enviar
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  groupSelector: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#eee',
    borderRadius: 15,
    color: '#333',
  },
  activeGroup: {
    backgroundColor: '#4a8cff',
    color: 'white',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  senderText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    alignSelf: 'center',
    color: '#0084ff',
    fontWeight: 'bold',
    padding: 10,
  },
});
