import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  titulo: string;
};

export default function Botón({ titulo }: Props) {
  const manejarClick = () => {
    Alert.alert("¡Has hecho clic en el botón!");
  };

  return (
    <TouchableOpacity style={styles.contenedor} onPress={manejarClick}>
      <Text style={styles.titulo}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  titulo: {
    color: "#916ef1",
    fontSize: 16,
    fontWeight: "600",
  },
});
