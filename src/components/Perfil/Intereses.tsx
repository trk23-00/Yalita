import { StyleSheet, Text, View } from "react-native";

type Props = {
  interes: string;
};

export default function Intereses({ interes }: Props) {
  return (
    <View style={styles.interesesContainer}>
      <Text style={styles.interesesTexto}>{interes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  interesesContainer: {
    justifyContent: "flex-start",
    padding: 5,
  },
  interesesTexto: {
    color: "#916ef1",
    backgroundColor: "#ede9fe",
    borderRadius: 15,
    textAlign: "center",
    padding: 5,
  },
});
