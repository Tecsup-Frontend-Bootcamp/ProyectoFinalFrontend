import { useState, useEffect } from "react";
import { getInstrumentos } from "./services/api";
import InstrumentoGrid from "./components/InstrumentoGrid";
import Carrito from "./components/Carrito";
import "./styles/app.css";

const TIPOS = ["Todos", "Cuerda", "Viento", "Percusión", "Teclado"];

export default function App() {
  const [instrumentos, setInstrumentos]       = useState([]);
  const [filtro, setFiltro]                   = useState("Todos");
  const [carrito, setCarrito]                 = useState([]);
  const [carritoVisible, setCarritoVisible]   = useState(true);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    getInstrumentos()
      .then(setInstrumentos)
      .catch(() => alert("No se pudo conectar al servidor"))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = filtro === "Todos"
    ? instrumentos
    : instrumentos.filter((i) => i.tipo === filtro);

  const agregarAlCarrito = (inst) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === inst.id);
      if (existe) return prev.map((i) => i.id === inst.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...inst, cantidad: 1 }];
    });
    if (!carritoVisible) setCarritoVisible(true);
  };

  const eliminarDelCarrito = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id));
  const limpiarCarrito     = ()   => setCarrito([]);

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <div className="layout">

      {/* Panel principal */}
      <div className="main">

        {/* Header */}
        <header className="header">
          <div>
            <div className="header-title">🎵 Instrumentos</div>
            <div className="header-subtitle">{filtrados.length} instrumentos</div>
          </div>
          <button
            className={`btn-carrito ${carrito.length > 0 ? "activo" : "vacio"}`}
            onClick={() => setCarritoVisible((v) => !v)}
          >
            🛒 Carrito
            {carrito.length > 0 && (
              <span className="carrito-badge">{totalItems}</span>
            )}
          </button>
        </header>

        {/* Contenido */}
        <div className="content">

          {/* Filtros */}
          <div className="filtros">
            {TIPOS.map((tipo) => (
              <button
                key={tipo}
                className={`chip ${filtro === tipo ? "activo" : ""}`}
                onClick={() => setFiltro(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <p className="estado-msg">Cargando instrumentos...</p>
          ) : (
            <InstrumentoGrid
              instrumentos={filtrados}
              onAgregar={agregarAlCarrito}
            />
          )}

        </div>
      </div>

      {/* Carrito lateral */}
      <Carrito
        items={carrito}
        onEliminar={eliminarDelCarrito}
        onLimpiar={limpiarCarrito}
        visible={carritoVisible}
        onToggle={() => setCarritoVisible(false)}
      />

    </div>
  );
}