import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Keyboard } from 'react-native';
import axios from 'axios';

const MEU_BACKEND_URL = 'http://SEU_IP_AQUI:3000/livros'; 

export default function App() {
  const [minhaEstante, setMinhaEstante] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [livroBuscado, setLivroBuscado] = useState(null);
  const [loadingBusca, setLoadingBusca] = useState(false);

  useEffect(() => {
    carregarEstante();
  }, []);

  const carregarEstante = async () => {
    try {
      const response = await axios.get(MEU_BACKEND_URL);
      setMinhaEstante(response.data);
    } catch (error) {
      console.error("Erro ao carregar estante. Verifique se o backend está rodando e o IP está correto.", error);
    }
  };

  const buscarNaOpenLibrary = async () => {
    if (!termoBusca) return;
    setLoadingBusca(true);
    Keyboard.dismiss();

    try {

      const response = await axios.get(`https://openlibrary.org/search.json?q=${termoBusca}&limit=1`);
      
      if (response.data.docs.length > 0) {
        const livro = response.data.docs[0];
        setLivroBuscado({
          titulo: livro.title,
          autor: livro.author_name ? livro.author_name[0] : 'Autor Desconhecido'
        });
      } else {
        alert("Livro não encontrado na Open Library!");
      }
    } catch (error) {
      console.error("Erro na API Pública", error);
    } finally {
      setLoadingBusca(false);
    }
  };

  // Salva o livro buscado no SEU backend (CREATE)
  const adicionarAoMeuBackend = async () => {
    if (!livroBuscado) return;
    try {
      await axios.post(MEU_BACKEND_URL, {
        titulo: livroBuscado.titulo,
        autor: livroBuscado.autor,
        status: "Quero Ler"
      });
      setLivroBuscado(null);
      setTermoBusca('');
      carregarEstante();
    } catch (error) {
      console.error("Erro ao salvar no backend", error);
    }
  };

  // Edita o status do livro no SEU backend (UPDATE)
  const marcarComoLido = async (id) => {
    try {
      await axios.put(`${MEU_BACKEND_URL}/${id}`, {
        status: "Lido"
      });
      carregarEstante();
    } catch (error) {
      console.error("Erro ao atualizar", error);
    }
  };

  // Remove o livro do SEU backend (DELETE)
  const deletarLivro = async (id) => {
    try {
      await axios.delete(`${MEU_BACKEND_URL}/${id}`);
      carregarEstante();
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📚 Minha Biblioteca</Text>

      {/* SESSÃO 1: BUSCA NA API PÚBLICA */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Adicionar Novo Livro</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do livro..."
          value={termoBusca}
          onChangeText={setTermoBusca}
        />
        <TouchableOpacity style={styles.btnPrimary} onPress={buscarNaOpenLibrary}>
          <Text style={styles.btnText}>Buscar na Open Library</Text>
        </TouchableOpacity>

        {loadingBusca && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />}

        {livroBuscado && (
          <View style={styles.resultBox}>
            <Text style={styles.bookTitle}>{livroBuscado.titulo}</Text>
            <Text style={styles.bookAuthor}>Por: {livroBuscado.autor}</Text>
            <TouchableOpacity style={styles.btnSuccess} onPress={adicionarAoMeuBackend}>
              <Text style={styles.btnText}>Salvar na Minha Estante</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SESSÃO 2: O SEU CRUD REAL */}
      <Text style={styles.sectionTitle}>Minha Estante</Text>
      <FlatList
        data={minhaEstante}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookTitle}>{item.titulo}</Text>
              <Text style={styles.bookAuthor}>{item.autor} • {item.anoLancamento}</Text>
              <Text style={[styles.status, item.status === 'Lido' ? styles.statusLido : styles.statusPendente]}>
                {item.status}
              </Text>
            </View>
            <View style={styles.actions}>
              {item.status !== 'Lido' && (
                <TouchableOpacity style={styles.btnAction} onPress={() => marcarComoLido(item.id)}>
                  <Text style={{ color: 'white' }}>✓ Lido</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.btnAction, { backgroundColor: '#e74c3c' }]} onPress={() => deletarLivro(item.id)}>
                <Text style={{ color: 'white' }}>X Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum livro salvo ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', paddingTop: 60, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50' },
  input: { borderWidth: 1, borderColor: '#dcdde1', borderRadius: 8, padding: 10, marginBottom: 10 },
  btnPrimary: { backgroundColor: '#3498db', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnSuccess: { backgroundColor: '#2ecc71', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  resultBox: { marginTop: 15, padding: 10, backgroundColor: '#f1f2f6', borderRadius: 8 },
  bookItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2, alignItems: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold' },
  bookAuthor: { fontSize: 14, color: '#7f8c8d' },
  status: { fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  statusLido: { color: '#2ecc71' },
  statusPendente: { color: '#e67e22' },
  actions: { justifyContent: 'space-between', marginLeft: 10 },
  btnAction: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, backgroundColor: '#3498db', marginBottom: 5, alignItems: 'center' }
});