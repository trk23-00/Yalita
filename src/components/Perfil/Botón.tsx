import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  titulo: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function Botón({ titulo, onPress, disabled = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.contenedor, disabled && styles.deshabilitado]}
      onPress={onPress ?? (() => Alert.alert("Funcionalidad pendiente"))}
      disabled={disabled}
    >
      <Text style={styles.titulo}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignItems: "center",
  },
  titulo: { color: "#916ef1", fontSize: 16, fontWeight: "600" },
  deshabilitado: { opacity: 0.5 },
});
