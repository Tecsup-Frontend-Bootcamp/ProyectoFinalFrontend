const BASE = import.meta.env.VITE_API_BASE_URL;

export const getInstrumentos = async () => {
  const res = await fetch(`${BASE}/instrumentos`);
  if (!res.ok) throw new Error("Error al obtener instrumentos");
  return res.json();
};

export const createPedido = async (data) => {
  const res = await fetch(`${BASE}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al guardar pedido");
  return res.json();
};