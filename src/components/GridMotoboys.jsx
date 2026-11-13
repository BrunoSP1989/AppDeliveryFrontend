"use client";

export default function GridMotoboys({ motoboys, loading, onAddMotoboy }) {
    const header = (
        <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
                {motoboys?.length || 0} entregador(es) cadastrado(s)
            </p>
            <button
                type="button"
                onClick={onAddMotoboy}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
                + Novo motoboy
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    if (!motoboys || motoboys.length === 0) {
        return (
            <div className="space-y-4">
                {header}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-slate-500">Nenhum motoboy cadastrado ou encontrado para esta loja.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {header}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {motoboys.map((motoboy) => {
                    const comissao = motoboy.commission ?? motoboy.comissao;
                    return (
                        <div
                            key={motoboy._id || motoboy.idMotoboy}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">{motoboy.nome || motoboy.name}</h3>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                    Ativo
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">
                                <span className="font-medium text-slate-700">Comissão:</span>{" "}
                                {comissao ?? "Não informada"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}