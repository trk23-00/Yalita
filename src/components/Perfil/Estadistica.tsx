import { StyleSheet, Text, View } from "react-native";

type Props = {
  valor: string | number;
  titulo: string;
};

export default function Estadistica({ valor, titulo }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    gap: 5,
  },
  valor: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  titulo: {
    fontSize: 11,
    color: "#8c90a0",
  },
});
