import {
  actualizarPerfil,
  cerrarSesion,
  iniciarSesion,
  obtenerMatches,
  obtenerPerfil,
  obtenerUsuario,
  type DatosPerfil,
  type Usuario,
} from "@/services/yalita";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Boton from "./Botón";
import Estadistica from "./Estadistica";
import Etiqueta from "./Etiqueta";
import Intereses from "./Intereses";
import SeccionPerfil from "./SeccionPerfil";

export default function Perfil() {
  // El formulario es un acceso temporal para mostrar Perfil sin modificar
  // el modulo Inicio-Sesion que trabaja otro integrante del equipo.
  const [email, setEmail] = useState("ana@test.com");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [perfil, setPerfil] = useState<DatosPerfil | null>(null);
  const [matches, setMatches] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [editando, setEditando] = useState(false);
  const [informacionEditada, setInformacionEditada] = useState("");
  const [interesesEditados, setInteresesEditados] = useState("");

  async function cargarDatos(usuarioId: string, jwt: string) {
    const [datosUsuario, datosPerfil, datosMatches] = await Promise.all([
      obtenerUsuario(usuarioId, jwt),
      obtenerPerfil(usuarioId, jwt),
      obtenerMatches(jwt),
    ]);
    setUsuario(datosUsuario);
    setPerfil(datosPerfil);
    setMatches(datosMatches.length);
    setInformacionEditada(datosPerfil.informacion ?? "");
    setInteresesEditados(datosPerfil.intereses.join(", "));
  }

  async function ingresar() {
    setError("");
    setExito("");
    setOcupado(true);
    try {
      const sesion = await iniciarSesion(email, password);
      await cargarDatos(sesion.usuario.id, sesion.token);
      setToken(sesion.token); // Solo memoria; no se guarda en .env ni en archivos.
      setPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesion.");
    } finally {
      setOcupado(false);
    }
  }

  async function recargar() {
    if (!usuario || !token) return;
    setError("");
    setExito("");
    setOcupado(true);
    try {
      await cargarDatos(usuario.id, token);
      setEditando(false);
      setExito("Datos actualizados desde PostgreSQL.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo actualizar el perfil.",
      );
    } finally {
      setOcupado(false);
    }
  }

  async function guardar() {
    if (!perfil || !token) return;
    setError("");
    setExito("");
    setOcupado(true);
    try {
      const intereses = interesesEditados
        .split(",")
        .map((valor) => valor.trim())
        .filter(Boolean);
      const actualizado = await actualizarPerfil(perfil.id, token, {
        informacion: informacionEditada.trim() || null,
        intereses,
      });
      setPerfil(actualizado);
      setInformacionEditada(actualizado.informacion ?? "");
      setInteresesEditados(actualizado.intereses.join(", "));
      setEditando(false);
      setExito("Perfil guardado en PostgreSQL.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setOcupado(false);
    }
  }

  async function salir() {
    if (token) {
      try {
        await cerrarSesion(token);
      } catch {
        // Aun sin conexion, se limpia la sesion del estado de esta pantalla.
      }
    }
    setToken(null);
    setUsuario(null);
    setPerfil(null);
    setPassword("");
    setEditando(false);
    setError("");
    setExito("");
  }

  if (!usuario || !perfil || !token) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.mainContainer}
      >
        <Text style={styles.encabezado}>Mi Perfil</Text>
        <SeccionPerfil titulo="INGRESAR — DEMOSTRACIÓN">
          <Text style={styles.sobreMiContenido}>
            Ingresa con una cuenta existente de Yalita. Ejemplo: ana@test.com.
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Correo"
            placeholderTextColor="#7b7087"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Contraseña"
            placeholderTextColor="#7b7087"
          />
          <Boton
            titulo={ocupado ? "Conectando..." : "Cargar mi perfil"}
            onPress={ingresar}
            disabled={ocupado}
          />
          {ocupado && <ActivityIndicator color="#916ef1" />}
          {!!error && <Text style={styles.error}>{error}</Text>}
        </SeccionPerfil>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.mainContainer}
    >
      <Text style={styles.encabezado}>Mi Perfil</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>
          {usuario.nombre.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.nombreContainer}>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.carrera}>
          {usuario.tipo_usuario
            ? `Tipo de cuenta: ${usuario.tipo_usuario}`
            : "Carrera y semestre no registrados"}
        </Text>
        {usuario.verificado ? (
          <Etiqueta texto="Cuenta verificada" />
        ) : (
          <Text style={styles.carrera}>Sin verificar</Text>
        )}
      </View>

      <View style={styles.estadisticasContainer}>
        <Estadistica valor={matches} titulo="Matches" />
        <Estadistica valor="—" titulo="Compatib." />
        <Estadistica valor="—" titulo="Vistas" />
      </View>

      <SeccionPerfil titulo="SOBRE MÍ">
        {editando ? (
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            multiline
            value={informacionEditada}
            onChangeText={setInformacionEditada}
            maxLength={2000}
            placeholder="Escribe tu biografía"
            placeholderTextColor="#7b7087"
          />
        ) : (
          <Text style={styles.sobreMiContenido}>
            {perfil.informacion || "Este usuario aún no tiene biografía."}
          </Text>
        )}
      </SeccionPerfil>

      <SeccionPerfil titulo="INTERESES">
        {editando ? (
          <TextInput
            style={styles.input}
            value={interesesEditados}
            onChangeText={setInteresesEditados}
            placeholder="programación, música, senderismo"
            placeholderTextColor="#7b7087"
          />
        ) : (
          <View style={styles.interesesContainer}>
            {perfil.intereses.map((interes, indice) => (
              <Intereses key={`${interes}-${indice}`} interes={interes} />
            ))}
            {perfil.intereses.length === 0 && (
              <Text style={styles.sobreMiContenido}>
                Sin intereses registrados.
              </Text>
            )}
          </View>
        )}
      </SeccionPerfil>

      <View style={styles.botonesContainer}>
        <Boton
          titulo={editando ? "Guardar" : "Editar perfil"}
          onPress={editando ? guardar : () => setEditando(true)}
          disabled={ocupado}
        />
        <Boton
          titulo={editando ? "Cancelar" : "Recargar"}
          onPress={editando ? () => setEditando(false) : recargar}
          disabled={ocupado}
        />
      </View>
      {ocupado && <ActivityIndicator color="#916ef1" />}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!exito && <Text style={styles.exito}>{exito}</Text>}
      <TouchableOpacity onPress={salir}>
        <Text style={styles.cerrarSesion}>Cerrar sesión</Text>
      </TouchableOpacity>
      <Text style={styles.nota}>
        Demostración: información leída desde PostgreSQL mediante Cloudflare
        Tunnel.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#faf5ff" },
  mainContainer: { alignItems: "center", padding: 24, gap: 20 },
  encabezado: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "700",
    color: "#241b35",
  },
  nombreContainer: { alignItems: "center", gap: 8 },
  nombre: { fontWeight: "700", fontSize: 25, textAlign: "center" },
  carrera: { color: "#8c90a0", fontSize: 14, textAlign: "center" },
  estadisticasContainer: { flexDirection: "row", width: "100%", gap: 12 },
  sobreMiContenido: { fontSize: 13, lineHeight: 20, color: "#8c90a0" },
  interesesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  cerrarSesion: { color: "#f04f5a", fontSize: 15, fontWeight: "600" },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#916ef1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTexto: { fontSize: 40, fontWeight: "700", color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#d7c8f4",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: "#241b35",
    width: "100%",
    fontSize: 14,
  },
  inputMultilinea: { minHeight: 90, textAlignVertical: "top" },
  error: { color: "#c0392b", fontSize: 13, textAlign: "center" },
  exito: { color: "#15803d", fontSize: 13, textAlign: "center" },
  nota: { color: "#8c90a0", fontSize: 11, textAlign: "center" },
});
