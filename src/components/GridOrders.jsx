"use client";

import { useState } from "react";
import PrintOrderButton from "./PrintOrderButton";

// Cores dinâmicas por status (fácil identificação visual na correria da operação)
const STATUS_MAP = {
    "PENDENTE": {
        badge: "bg-amber-50 text-amber-700 border-amber-200/80",
        dot: "bg-amber-500",
    },
    "EM ROTA": {
        badge: "bg-blue-50 text-blue-700 border-blue-200/80",
        dot: "bg-blue-500 animate-pulse", // Pulsa sutilmente para indicar pedido em movimento
    },
    "ENTREGUE": {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dot: "bg-emerald-500",
    },
    "CANCELADO": {
        badge: "bg-rose-50 text-rose-700 border-rose-200/80",
        dot: "bg-rose-500",
    },
    DEFAULT: {
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
    },
};

function StatusBadge({ status }) {
    const key = String(status || "").trim().toUpperCase();
    const theme = STATUS_MAP[key] || STATUS_MAP.DEFAULT;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shrink-0 ${theme.badge}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
            {status || "-"}
        </span>
    );
}

const formatMoney = (v) =>
    typeof v === "number"
        ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : v ?? "-";

export default function GridOrders({
    orders,
    loading,
    totalOrders,
    totalPages,
    currentPage,
    setCurrentPage,
    motoboys = [],
    store,
    onAssignMotoboy,
}) {
    const [assigningId, setAssigningId] = useState(null);

    const handleChangeMotoboy = async (orderId, motoboyId) => {
        if (!motoboyId) return;
        try {
            setAssigningId(orderId);
            await onAssignMotoboy(orderId, motoboyId);
        } finally {
            setAssigningId(null);
        }
    };

    return (
        <section className="bg-white border border-slate-200/85 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Cabeçalho da Seção */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Pedidos Recebidos
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Acompanhe e gerencie as entregas da loja em tempo real.
                    </p>
                </div>

                {typeof totalOrders === "number" && (
                    <span className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                        Total: <strong className="text-slate-900">{totalOrders}</strong>
                    </span>
                )}
            </div>

            {/* Estados de Carregamento e Vazio */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-7 h-7 border-[3px] border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Carregando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/50">
                    <svg
                        className="w-12 h-12 mx-auto text-slate-300 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                    </svg>
                    <p className="text-sm font-semibold text-slate-600">
                        Nenhum pedido encontrado.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Novos pedidos aparecerão listados aqui automaticamente.
                    </p>
                </div>
            ) : (
                /* Grid de Cards */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {orders.map((order) => {
                        const shortId = String(order._id || "").slice(-6).toUpperCase();
                        const c = order.client || {};
                        const cidadeFormatada = c.cidade
                            ? c.estado
                                ? `${c.cidade}/${c.estado}`
                                : c.cidade
                            : "";

                        const assignedId = order.motoboyId?._id || order.motoboyId || "";
                        const assignedMotoboy = assignedId
                            ? motoboys.find((m) => m._id === assignedId)
                            : null;
                        const assignedName =
                            assignedMotoboy?.name ||
                            order.motoboyId?.name ||
                            "Entregador vinculado";

                        return (
                            <div
                                key={order._id}
                                className="group bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-4">
                                    {/* Topo: ID + Cliente + Status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-900 text-white">
                                                    #{shortId}
                                                </span>
                                                <h3 className="font-bold text-slate-900 text-sm truncate">
                                                    {c.nome || "Cliente não informado"}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <svg
                                                    className="w-3.5 h-3.5 text-slate-400 shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    />
                                                </svg>
                                                <span>{c.telefone || "Sem telefone"}</span>
                                            </div>
                                        </div>

                                        <StatusBadge status={order.status} />
                                    </div>

                                    {/* Endereço Compacto com Ícone */}
                                    <div className="flex items-start gap-2.5 rounded-xl bg-slate-50/70 border border-slate-100 p-3 text-xs">
                                        <svg
                                            className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <div className="space-y-0.5 text-slate-600 leading-relaxed min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">
                                                {c.endereco || "Endereço não informado"},{" "}
                                                {c.numero || "S/N"}
                                            </p>
                                            <p className="text-slate-500 truncate">
                                                {[c.bairro, cidadeFormatada]
                                                    .filter(Boolean)
                                                    .join(" • ") || "Bairro/Cidade não informados"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Lista de Itens */}
                                    <div className="rounded-xl bg-slate-50 border border-slate-100/90 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Itens do Pedido
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-400">
                                                {order.items?.length || 0}{" "}
                                                {order.items?.length === 1 ? "item" : "itens"}
                                            </span>
                                        </div>

                                        {order.items?.length ? (
                                            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                                {order.items.map((item, i) => (
                                                    <div
                                                        key={item.idProduto || i}
                                                        className="flex items-center justify-between gap-2 text-xs"
                                                    >
                                                        <p className="text-slate-700 truncate">
                                                            <span className="inline-block font-bold text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-0.2 mr-1.5 text-[11px]">
                                                                {item.quantidade}x
                                                            </span>
                                                            {item.descricao}
                                                        </p>
                                                        {typeof item.precoVenda === "number" && (
                                                            <span className="text-slate-500 font-medium shrink-0">
                                                                {formatMoney(
                                                                    item.precoVenda * item.quantidade
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">
                                                Sem itens registrados.
                                            </p>
                                        )}
                                    </div>

                                    {/* Seleção de Entregador */}
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor={`motoboy-${order._id}`}
                                            className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                                        >
                                            Entregador Responsável
                                        </label>

                                        {assignedId ? (
                                            <div
                                                className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200/90 bg-emerald-50/70 px-3.5 py-2 text-xs font-semibold text-emerald-800"
                                                title="Entregador já vinculado a este pedido"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                    <span className="truncate">{assignedName}</span>
                                                </div>
                                                <svg
                                                    className="w-4 h-4 shrink-0 text-emerald-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                        ) : (
                                            <select
                                                id={`motoboy-${order._id}`}
                                                value=""
                                                onChange={(e) =>
                                                    handleChangeMotoboy(order._id, e.target.value)
                                                }
                                                disabled={assigningId === order._id}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <option value="">
                                                    {assigningId === order._id
                                                        ? "Vinculando entregador..."
                                                        : "Selecionar entregador para despacho..."}
                                                </option>
                                                {motoboys.map((m) => (
                                                    <option key={m._id} value={m._id}>
                                                        {m.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>

                                {/* Rodapé: Total + Horário + Botão de Impressão */}
                                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Valor Total
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-extrabold text-slate-900">
                                                {formatMoney(order.total)}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-medium">
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleTimeString(
                                                        "pt-BR",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <PrintOrderButton
                                        order={order}
                                        motoboys={motoboys}
                                        store={store}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Anterior
                    </button>
                    <span className="text-xs font-medium text-slate-500">
                        Página <strong className="text-slate-900">{currentPage}</strong> de{" "}
                        <strong className="text-slate-900">{totalPages}</strong>
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Próxima →
                    </button>
                </div>
            )}
        </section>
    );
}