export default function StoreHeader({ store }) {
    return (
        <div className="bg-white border border-slate-200/85 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Lado Esquerdo: Nome, CNPJ e Status */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            {store.fantasia || 'Nome da Loja'}
                        </h1>

                        {/* Badge de Status Compacta */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${store.active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${store.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                            {store.active ? 'Aberto' : 'Fechado'}
                        </span>
                    </div>

                    <p className="text-xs text-slate-500 font-mono">
                        CNPJ: {store.cnpj || 'Não informado'}
                    </p>
                </div>

                {/* Lado Direito: Informações Compactas (Contato, Horário e Endereço) */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 text-xs text-slate-600 bg-slate-50/75 p-3 rounded-xl border border-slate-100">

                    {/* E-mail */}
                    <div className="flex items-center gap-2 max-w-[200px]" title={store.email}>
                        <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{store.email || 'E-mail não inf.'}</span>
                    </div>

                    {/* Horário */}
                    <div className="flex items-center gap-2 shrink-0">
                        <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{store.abertura && store.fechamento ? `${store.abertura} - ${store.fechamento}` : 'Horário livre'}</span>
                    </div>

                    {/* Endereço */}
                    <div className="flex items-center gap-2 max-w-[220px]" title={store.address}>
                        <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{store.address || 'Endereço não informado'}</span>
                    </div>

                </div>

            </div>
        </div>
    );
}