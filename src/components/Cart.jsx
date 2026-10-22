"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, storeId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState('cart');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('DINHEIRO');
    const [client, setClient] = useState({
        nome: '',
        telefone: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    });

    const cartTotal = cartItems.reduce((acc, item) => {
        const price = Number(item.precoVenda) || 0;
        const qty = Number(item.quantity) || 1;
        return acc + price * qty;
    }, 0);

    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClient((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        try {
            setLoading(true);
            const orderItems = cartItems.map((item) => {
                const productId = item.id || item._id || item.idProduto;

                return {
                    productId: productId,
                    id: productId,
                    _id: productId,
                    idProduto: item.idProduto,
                    descricao: item.descricao,
                    quantidade: item.quantity || 1,
                    precoVenda: item.precoVenda
                };
            });

            const payload = {
                storeId: storeId,
                items: orderItems,
                client: client,
                PaymentMethod: paymentMethod
            };

            await axios.post(`http://localhost:3000/create-order`, payload);

            setSuccessMsg('Pedido realizado com sucesso!');
            setClient({
                nome: '',
                telefone: '',
                endereco: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: ''
            });
            onClearCart();
            setTimeout(() => {
                setSuccessMsg('');
                setStep('cart');
                setIsOpen(false);
            }, 3000);

        } catch (error) {
            console.error('Erro detalhado ao criar pedido (404):', {
                mensagem: error.message,
                status: error.response?.status,
                dados: error.response?.data,
                urlChamada: error.config?.url
            });
            alert('Não foi possível finalizar o pedido. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Botão Flutuante do Carrinho */}
            <button
                onClick={() => { setIsOpen(true); setStep('cart'); }}
                className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 transition-all flex items-center justify-center group"
                aria-label="Abrir Carrinho"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Modal / Drawer - Alterado para centralizar */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity">
                    <div className="w-full max-w-md bg-white rounded-2xl max-h-[90vh] shadow-2xl flex flex-col p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-300">

                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {step === 'cart' ? 'Seu Carrinho' : 'Finalizar Pedido'}
                                    </h2>
                                    {step === 'cart' && (
                                        <span className="bg-cyan-50 text-cyan-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-cyan-100">
                                            {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {successMsg && (
                                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-xl text-center">
                                    {successMsg}
                                </div>
                            )}

                            {/* Passo 1: Lista do Carrinho */}
                            {step === 'cart' && !successMsg && (
                                <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto">
                                    {cartItems.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400 space-y-3">
                                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500">Seu carrinho está vazio.</p>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div key={item._id || item.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50/75 border border-slate-100 rounded-xl">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-12 h-12 bg-white border border-slate-200/80 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                                        {item.fotoUrl ? (
                                                            <img src={item.fotoUrl} alt={item.descricao} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-semibold text-slate-800 truncate">{item.descricao}</h4>
                                                        <p className="text-xs font-bold text-cyan-700 mt-0.5">
                                                            R$ {Number(item.precoVenda || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden shadow-2xs">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item._id || item.id, (item.quantity || 1) - 1)}
                                                            className="px-2 py-1 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-2 py-1 text-xs font-semibold text-slate-800 min-w-[24px] text-center">
                                                            {item.quantity || 1}
                                                        </span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item._id || item.id, (item.quantity || 1) + 1)}
                                                            className="px-2 py-1 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => onRemoveItem(item._id || item.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Passo 2: Formulário do Cliente */}
                            {step === 'checkout' && !successMsg && (
                                <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="py-4 space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            required
                                            value={client.nome}
                                            onChange={handleInputChange}
                                            placeholder="Seu nome"
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Telefone / WhatsApp</label>
                                        <input
                                            type="text"
                                            name="telefone"
                                            required
                                            value={client.telefone}
                                            onChange={handleInputChange}
                                            placeholder="(00) 00000-0000"
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Endereço (Rua)</label>
                                            <input
                                                type="text"
                                                name="endereco"
                                                required
                                                value={client.endereco}
                                                onChange={handleInputChange}
                                                placeholder="Nome da rua"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Número</label>
                                            <input
                                                type="text"
                                                name="numero"
                                                required
                                                value={client.numero}
                                                onChange={handleInputChange}
                                                placeholder="Nº"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Bairro</label>
                                            <input
                                                type="text"
                                                name="bairro"
                                                required
                                                value={client.bairro}
                                                onChange={handleInputChange}
                                                placeholder="Bairro"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">CEP</label>
                                            <input
                                                type="text"
                                                name="cep"
                                                value={client.cep}
                                                onChange={handleInputChange}
                                                placeholder="00000-000"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Cidade</label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                required
                                                value={client.cidade}
                                                onChange={handleInputChange}
                                                placeholder="Cidade"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
                                            <input
                                                type="text"
                                                name="estado"
                                                required
                                                value={client.estado}
                                                onChange={handleInputChange}
                                                placeholder="UF"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Forma de Pagamento</label>
                                        <select
                                            name="PaymentMethod"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:bg-white outline-none"
                                        >
                                            <option value="DINHEIRO">Dinheiro</option>
                                            <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                                            <option value="CARTAO_DEBITO">Cartão de Débito</option>
                                            <option value="TICKET">Ticket</option>
                                            <option value="PIX">PIX</option>
                                        </select>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Rodapé / Botões */}
                        {!successMsg && (
                            <div className="pt-4 mt-auto border-t border-slate-100 space-y-3 shrink-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Total:</span>
                                    <span className="text-lg font-extrabold text-slate-900">
                                        R$ {cartTotal.toFixed(2)}
                                    </span>
                                </div>

                                {step === 'cart' ? (
                                    <button
                                        onClick={() => setStep('checkout')}
                                        disabled={cartItems.length === 0}
                                        className="w-full py-3 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        Continuar para Dados
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep('cart')}
                                            className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            form="checkout-form"
                                            disabled={loading}
                                            className="w-2/3 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Enviando...' : 'Confirmar Pedido'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
}