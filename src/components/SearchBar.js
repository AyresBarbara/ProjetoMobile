import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChangeText, onSubmitEditing }) {
  return (
   // View para entrada de dados
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}                
        placeholder="Buscar livros..."      
        value={value}                       
        onChangeText={onChangeText}         
        onSubmitEditing={onSubmitEditing}   
      />
    </View>
  );
}
const styles = StyleSheet.create({
  
  inputContainer: { padding: 10 },
  
  input: {
    backgroundColor: '#363636',  
    padding: 10,                 
    borderRadius: 8,
    color: '#fff'            
  },
});
