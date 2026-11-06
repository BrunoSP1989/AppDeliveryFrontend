"use client";

export default function GridMotoboys({ motoboys, loading }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    if (!motoboys || motoboys.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-slate-500">Nenhum motoboy cadastrado ou encontrado para esta loja.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {motoboys.map((motoboy) => (
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
                        <span className="font-medium text-slate-700">Telefone:</span> {motoboy.telefone || motoboy.phone || "Não informado"}
                    </p>
                </div>
            ))}
        </div>
    );
}