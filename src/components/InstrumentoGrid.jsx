import { emojiPorTipo, colorPorTipo } from "../utils/instrumentoHelper";

export default function InstrumentoGrid({ instrumentos, onAgregar }) {
  if (instrumentos.length === 0) {
    return <p className="estado-msg">No hay instrumentos en esta categoría.</p>;
  }

  return (
    <div className="grid">
      {instrumentos.map((inst) => {
        const emoji = emojiPorTipo[inst.tipo] || "🎵";
        const bg = colorPorTipo[inst.tipo] || "#f0f0f0";

        return (
          <div key={inst.id} className="card">
            <div className="card-emoji" style={{ background: bg }}>
              {emoji}
            </div>
            <div className="card-body">
              <div className="card-nombre">{inst.nombre}</div>
              <div className="card-sub">{inst.marca} · {inst.tipo}</div>
              <div className="card-precio">S/. {inst.precio.toFixed(2)}</div>
              <div className="card-footer">
                <span className={`badge ${inst.disponible ? "disponible" : "no-disponible"}`}>
                  {inst.disponible ? "Disponible" : "No disponible"}
                </span>
                <button
                  className={`btn-agregar ${inst.disponible ? "activo" : "inactivo"}`}
                  disabled={!inst.disponible}
                  onClick={() => onAgregar({ ...inst, emoji })}
                >
                  + Agregar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}