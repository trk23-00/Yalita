import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  titulo: string;
  children: ReactNode;
};

export default function SeccionPerfil({ titulo, children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    gap: 10,
  },
  titulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#916ef1",
  },
});
