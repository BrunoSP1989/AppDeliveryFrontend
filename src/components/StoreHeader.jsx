'use client';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext'; // Ajuste o caminho se necessário

export default function StoreHeader({ store }) {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug || store?.slug || '';

    const handleClick = () => {
        if (user) {
            router.push(`/${slug}/admin`);
        } else {
            router.push(`/${slug}/admin/login`);
        }
    };

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* Lado Esquerdo: Nome, CNPJ e Status */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            {store?.fantasia || 'Nome da Loja'}
                        </h1>

                        {/* Badge de Status Profissional */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${store?.active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${store?.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                            {store?.active ? 'Aberto Agora' : 'Fechado'}
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono tracking-wide">
                        CNPJ: <span className="text-slate-600">{store?.cnpj || 'Não informado'}</span>
                    </p>
                </div>

                {/* Lado Direito: Informações e Botão de Acesso */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6 bg-slate-50/80 p-4 rounded-xl border border-slate-100">

                    {/* Bloco de Informações de Contato/Endereço */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 text-xs text-slate-600">
                        {/* E-mail */}
                        <div className="flex items-center gap-2 max-w-[180px]" title={store?.email}>
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="truncate">{store?.email || 'E-mail não inf.'}</span>
                        </div>

                        {/* Horário */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span>{store?.abertura && store?.fechamento ? `${store.abertura} - ${store.fechamento}` : 'Horário livre'}</span>
                        </div>

                        {/* Endereço */}
                        <div className="flex items-center gap-2 max-w-[200px]" title={store?.address}>
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="truncate">{store?.address || 'Endereço não informado'}</span>
                        </div>
                    </div>

                    {/* Linha Divisória sutil no desktop */}
                    <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                    {/* Botão Dinâmico ADMIN / LOGIN */}
                    <button
                        onClick={handleClick}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-sm cursor-pointer ${user
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                            }`}
                    >
                        {user ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                PAINEL ADMIN
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                FAZER LOGIN
                            </>
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}