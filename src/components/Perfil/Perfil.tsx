import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Boton from "./Botón";
import Estadistica from "./Estadistica";
import Etiqueta from "./Etiqueta";
import Intereses from "./Intereses";
import SeccionPerfil from "./SeccionPerfil";

const intereses = ["Tecnología", "Gaming", "Música", "Viajes", "Tecnología"];

export default function Perfil() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.mainContainer}
    >
      <Text style={styles.encabezado}>Mi Perfil</Text>
      <Image
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={styles.pfp}
      />
      <View style={styles.nombreContainer}>
        <Text style={styles.nombre}>Rodrigo López, 21</Text>
        <Text style={styles.carrera}>Ing. de Sistemas · 5to Semestre</Text>
        <Etiqueta texto="Verificado EMI" />
      </View>

      <View style={styles.estadisticasContainer}>
        <Estadistica valor={12} titulo="Matches" />
        <Estadistica valor="87%" titulo="Compatib." />
        <Estadistica valor={48} titulo="Vistas" />
      </View>

      <SeccionPerfil titulo="SOBRE MÍ">
        <Text style={styles.sobreMiContenido}>
          Apasionado por la tecnología y los viajes. Estudio sistemas en la EMI
          y busco personas interesantes con quienes explorar ideas y aventuras.
        </Text>
      </SeccionPerfil>

      <SeccionPerfil titulo="INTERESES">
        <View style={styles.interesesContainer}>
          {intereses.map((interes, index) => (
            <Intereses key={`${interes}-${index}`} interes={interes} />
          ))}
        </View>
      </SeccionPerfil>
      <View style={styles.botonesContainer}>
        <Boton titulo="Configuración"></Boton>
        <Boton titulo="Privacidad"></Boton>
      </View>
      <Text style={styles.cerrarSesion}>Cerrar Sesión</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#faf5ff",
  },
  mainContainer: {
    alignItems: "center",
    padding: 24,
    gap: 20,
  },
  encabezado: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    color: "#241b35",
  },
  nombreContainer: {
    alignItems: "center",
    gap: 8,
  },
  nombre: {
    fontWeight: "700",
    fontSize: 25,
    textAlign: "center",
  },
  carrera: {
    color: "#8c90a0",
    fontSize: 14,
    textAlign: "center",
  },
  estadisticasContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  sobreMiContenido: {
    fontSize: 13,
    lineHeight: 20,
    color: "#8c90a0",
  },
  interesesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cerrarSesion: {
    color: "#f04f5a",
  },
  pfp: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fff",
  },
});
