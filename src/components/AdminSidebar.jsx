"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../app/context/AuthContext"; 

const ICONS = {
    produtos: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    pedidos: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    sair: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    menu: "M4 6h16M4 12h16M4 18h16",
    fechar: "M6 18L18 6M6 6l12 12",
};

function Icon({ name, className = "h-5 w-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d={ICONS[name]} />
        </svg>
    );
}

function SidebarContent({ storeName, items, active, onSelect }) {
    const { logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug || '';

    async function handleLogout() {
        try {
            await logout(); // Limpa o cookie http-only no backend e zera o user no context
            router.replace(`/${slug}/admin/login`); // Redireciona para a tela de login da loja atual
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    }

    return (
        <div className="flex h-full flex-col bg-slate-900 text-slate-300">
            {/* Marca / loja */}
            <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                    {(storeName || "L").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{storeName}</p>
                    <p className="text-xs text-slate-500">Painel administrativo</p>
                </div>
            </div>

            {/* Navegação */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Gerenciar
                </p>
                {items.map((item) => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon name={item.icon} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {typeof item.badge === "number" && item.badge > 0 && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                                        }`}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Rodapé */}
            <div className="border-t border-slate-800 p-3">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <Icon name="sair" />
                    Sair
                </button>
            </div>
        </div>
    );
}

export default function AdminSidebar({ storeName, items, active, onSelect }) {
    const [open, setOpen] = useState(false);

    function handleSelect(id) {
        onSelect(id);
        setOpen(false);
    }

    return (
        <>
            {/* Desktop: fixa à esquerda */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
                <SidebarContent
                    storeName={storeName}
                    items={items}
                    active={active}
                    onSelect={handleSelect}
                />
            </aside>

            {/* Mobile: barra superior */}
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
                <p className="truncate text-sm font-semibold text-white">{storeName}</p>
                <button
                    onClick={() => setOpen(true)}
                    className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800"
                    aria-label="Abrir menu"
                >
                    <Icon name="menu" />
                </button>
            </div>

            {/* Mobile: gaveta */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-64 shadow-xl">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute right-3 top-4 z-10 rounded-lg p-1 text-slate-400 hover:text-white"
                            aria-label="Fechar menu"
                        >
                            <Icon name="fechar" />
                        </button>
                        <SidebarContent
                            storeName={storeName}
                            items={items}
                            active={active}
                            onSelect={handleSelect}
                        />
                    </div>
                </div>
            )}
        </>
    );
}