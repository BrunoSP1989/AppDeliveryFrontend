"use client";

import { useState } from "react";
import PrintOrderButton from "./PrintOrderButton";

const STATUS_STYLES = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
};

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES.default}`}
        >
            {status || "-"}
        </span>
    );
}

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
            <div className="pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Pedidos Recebidos</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                    {typeof totalOrders === "number"
                        ? `Acompanhe os pedidos da loja (${totalOrders} encontrados).`
                        : "Acompanhe os pedidos da loja."}
                </p>
            </div>

            {loading ? (
                <div className="py-16 text-center">
                    <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-slate-500">Carregando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50/50">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <p className="text-sm font-medium text-slate-600">Nenhum pedido encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                {/* Topo: cliente + status */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-800 text-sm truncate">
                                            {order.client?.nome || "Cliente não informado"}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            {order.client?.telefone || "Sem telefone"}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Endereço */}
                                <div className="space-y-1 text-sm leading-snug">
                                    <p>
                                        <span className="font-semibold text-slate-500">Endereço: </span>
                                        <span className="text-slate-800">{order.client?.endereco || "-"}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-500">Número: </span>
                                        <span className="text-slate-800">{order.client?.numero || "-"}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-500">Bairro: </span>
                                        <span className="text-slate-800">{order.client?.bairro || "-"}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-500">Cidade: </span>
                                        <span className="text-slate-800">
                                            {order.client?.cidade
                                                ? order.client?.estado
                                                    ? `${order.client.cidade}/${order.client.estado}`
                                                    : order.client.cidade
                                                : "-"}
                                        </span>
                                    </p>
                                </div>

                                {/* Itens */}
                                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Itens
                                    </span>
                                    {order.items?.length ? (
                                        order.items.map((item, i) => (
                                            <p
                                                key={item.idProduto || i}
                                                className="text-xs text-slate-700 line-clamp-1"
                                            >
                                                <strong className="text-slate-900">{item.quantidade}x</strong>{" "}
                                                {item.descricao}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400">Sem itens.</p>
                                    )}
                                </div>

                                {/* Entregador */}
                                {(() => {
                                    const assignedId = order.motoboyId?._id || order.motoboyId || "";
                                    const assignedMotoboy = assignedId
                                        ? motoboys.find((m) => m._id === assignedId)
                                        : null;
                                    const assignedName =
                                        assignedMotoboy?.name || order.motoboyId?.name || "Entregador vinculado";

                                    return (
                                        <div className="space-y-1">
                                            <label
                                                htmlFor={`motoboy-${order._id}`}
                                                className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
                                            >
                                                Entregador
                                            </label>

                                            {assignedId ? (
                                                <div
                                                    className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 cursor-not-allowed"
                                                    title="Entregador já vinculado a este pedido"
                                                >
                                                    <span className="truncate">{assignedName}</span>
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
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                        />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <select
                                                    id={`motoboy-${order._id}`}
                                                    value=""
                                                    onChange={(e) => handleChangeMotoboy(order._id, e.target.value)}
                                                    disabled={assigningId === order._id}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <option value="">Selecione um entregador</option>
                                                    {motoboys.map((m) => (
                                                        <option key={m._id} value={m._id}>
                                                            {m.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Rodapé: data + total + imprimir */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-cyan-700">
                                        {typeof order.total === "number"
                                            ? order.total.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })
                                            : order.total ?? "-"}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        {order.createdAt
                                            ? new Date(order.createdAt).toLocaleString("pt-BR")
                                            : "-"}
                                    </span>
                                </div>

                                <PrintOrderButton order={order} motoboys={motoboys} store={store} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Página <strong className="text-slate-900">{currentPage}</strong> de <strong className="text-slate-900">{totalPages}</strong>
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </section>
    );
}