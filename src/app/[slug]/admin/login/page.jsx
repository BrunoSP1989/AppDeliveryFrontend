'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const params = useParams();
    const slug = params?.slug || '';

    // Transforma 'minha-loja-legal' em 'Minha Loja Legal'
    const storeName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            alert('Credenciais inválidas');
            setIsLoading(false);
        } else {
            router.push(`/${slug}/admin`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-slate-100">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Acesso Administrativo
                    </h1>
                    <p className="text-sm text-slate-500">
                        Gerenciando a loja <span className="font-semibold text-indigo-600">{storeName || 'Desconhecida'}</span>
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="admin@loja.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-slate-900"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-slate-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-slate-900"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? 'Autenticando...' : 'Entrar no Painel'}
                    </button>
                </form>
            </div>
        </div>
    );
}