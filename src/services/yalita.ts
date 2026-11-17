const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export type Usuario = {
  id: string;
  nombre: string;
  email?: string;
  verificado: boolean;
  tipo_usuario?: string | null;
};

export type DatosPerfil = {
  id: string;
  usuario_id: string;
  informacion: string | null;
  intereses: string[];
  gustos: string[];
  preferencias: string[];
};

export type Match = {
  id: string;
  usuario1_id: string;
  usuario2_id: string;
  fecha_match: string;
};

type RespuestaLogin = {
  token: string;
  token_type: string;
  expires_in: number;
  usuario: Usuario;
};

type Metodo = "GET" | "POST" | "PUT";

async function solicitud<T>(
  ruta: string,
  opciones: { metodo?: Metodo; token?: string; datos?: unknown } = {},
): Promise<T> {
  if (!BASE_URL) {
    throw new Error(
      "Falta EXPO_PUBLIC_API_URL en .env.local del proyecto Expo.",
    );
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${BASE_URL}/api/v1${ruta}`, {
      method: opciones.metodo ?? "GET",
      headers: {
        Accept: "application/json",
        ...(opciones.datos !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...(opciones.token
          ? { Authorization: `Bearer ${opciones.token}` }
          : {}),
      },
      ...(opciones.datos !== undefined
        ? { body: JSON.stringify(opciones.datos) }
        : {}),
    });
  } catch {
    throw new Error(
      "No hay conexion con la API. Comprueba el tunnel, Express y la URL de .env.local.",
    );
  }

  const texto = await respuesta.text();
  let resultado: any = null;
  if (texto) {
    try {
      resultado = JSON.parse(texto);
    } catch {
      throw new Error(
        "La API no devolvio un JSON valido. Comprueba la URL del tunnel.",
      );
    }
  }

  if (!respuesta.ok) {
    throw new Error(resultado?.error ?? `Error HTTP ${respuesta.status}`);
  }

  return resultado as T;
}

export function iniciarSesion(email: string, password: string) {
  return solicitud<RespuestaLogin>("/auth/login", {
    metodo: "POST",
    datos: { email: email.trim().toLowerCase(), password },
  });
}

export function obtenerUsuario(id: string, token: string) {
  return solicitud<Usuario>(`/usuarios/${encodeURIComponent(id)}`, { token });
}

export function obtenerPerfil(usuarioId: string, token: string) {
  return solicitud<DatosPerfil>(`/perfiles/${encodeURIComponent(usuarioId)}`, {
    token,
  });
}

export function obtenerMatches(token: string) {
  // El backend pagina; 100 es el máximo permitido por petición.
  // Suficiente para los 2 matches de los datos de prueba.
  return solicitud<Match[]>("/matches?limit=100", { token });
}

export function actualizarPerfil(
  perfilId: string,
  token: string,
  datos: { informacion: string | null; intereses: string[] },
) {
  return solicitud<DatosPerfil>(`/perfiles/${encodeURIComponent(perfilId)}`, {
    metodo: "PUT",
    token,
    datos,
  });
}

export function cerrarSesion(token: string) {
  return solicitud<null>("/auth/logout", { metodo: "POST", token });
}
