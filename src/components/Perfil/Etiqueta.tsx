import { StyleSheet, Text, View } from "react-native";

type Props = {
  texto: string;
};

export default function Etiqueta({ texto }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#16a34a",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  texto: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "500",
  },
});
