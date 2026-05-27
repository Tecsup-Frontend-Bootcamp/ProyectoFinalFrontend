import { useState } from "react";
import { createPedido } from "../services/api";

export default function Carrito({ items, onEliminar, onLimpiar, visible, onToggle }) {
  const [cliente, setCliente] = useState("");
  const [correo, setCorreo]   = useState("");
  const [errores, setErrores] = useState({});
  const [exito, setExito]     = useState(false);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const validar = () => {
    const e = {};
    if (!cliente.trim()) e.cliente = "El nombre es requerido";
    if (!correo.trim() || !/\S+@\S+\.\S+/.test(correo)) e.correo = "Correo inválido";
    if (items.length === 0) e.items = "El carrito está vacío";
    return e;
  };

  const handleConfirmar = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setErrores({});
    setLoading(true);
    try {
      await createPedido({
        cliente,
        correoCliente: correo,
        items: items.map((i) => ({
          instrumentoId:  i.id,
          nombre:         i.nombre,
          cantidad:       i.cantidad,
          precioUnitario: i.precio,
        })),
      });
      setExito(true);
      setCliente("");
      setCorreo("");
      onLimpiar();
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      alert("Error al confirmar pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`carrito ${visible ? "visible" : "oculto"}`}>
      {visible && (
        <div className="carrito-inner">

          <div className="carrito-header">
            <span className="carrito-titulo">🛒 Carrito ({items.length})</span>
            <button className="btn-cerrar" onClick={onToggle}>✕</button>
          </div>

          {exito && (
            <div className="exito-msg">✅ Pedido guardado correctamente</div>
          )}

          <div className="carrito-items">
            {items.length === 0 ? (
              <p className="carrito-vacio">Agrega instrumentos al carrito</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="carrito-item">
                  <div className="carrito-item-top">
                    <div>
                      <div className="carrito-item-nombre">{item.emoji} {item.nombre}</div>
                      <div className="carrito-item-marca">{item.marca}</div>
                    </div>
                    <button className="btn-quitar" onClick={() => onEliminar(item.id)}>✕</button>
                  </div>
                  <div className="carrito-item-bottom">
                    <span className="carrito-item-cant">x{item.cantidad}</span>
                    <span className="carrito-item-precio">
                      S/. {(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="carrito-footer">
            <div className="carrito-total">
              <span className="carrito-total-label">Total</span>
              <span className="carrito-total-valor">S/. {total.toFixed(2)}</span>
            </div>

            <div className="carrito-form">
              <input
                className="carrito-input"
                placeholder="Tu nombre"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              {errores.cliente && <span className="error-msg">{errores.cliente}</span>}

              <input
                className="carrito-input"
                placeholder="Tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {errores.correo && <span className="error-msg">{errores.correo}</span>}
              {errores.items  && <span className="error-msg">{errores.items}</span>}
            </div>

            <button
              className="btn-confirmar"
              onClick={handleConfirmar}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Confirmar pedido"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}