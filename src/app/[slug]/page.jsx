"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import StoreHeader from '../../components/StoreHeader';
import GridProducts from '../../components/GridProducts';
import Cart from '../../components/Cart';

export default function PaginaLoja() {
    const params = useParams();
    const slug = params?.slug;

    const [store, setStore] = useState(null);
    const [carregandoLoja, setCarregandoLoja] = useState(true);
    const [erroLoja, setErroLoja] = useState('');

    const [produtos, setProdutos] = useState([]);
    const [carregandoProdutos, setCarregandoProdutos] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProdutos, setTotalProdutos] = useState(0);

    // Estado do Carrinho
    const [cartItems, setCartItems] = useState([]);

    // Funções de manipulação do carrinho
    const handleAddToCart = (produto) => {
        setCartItems((prev) => {
            const itemId = produto._id || produto.id;
            const itemExiste = prev.find((item) => (item._id || item.id) === itemId);

            if (itemExiste) {
                return prev.map((item) =>
                    (item._id || item.id) === itemId
                        ? { ...item, quantidade: (item.quantidade || 1) + 1 }
                        : item
                );
            }
            return [...prev, { ...produto, quantidade: 1 }];
        });
    };

    const handleUpdateQuantity = (id, novaQtd) => {
        if (novaQtd <= 0) {
            handleRemoveItem(id);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => (item._id || item.id) === id ? { ...item, quantidade: novaQtd } : item)
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    useEffect(() => {
        async function getStore() {
            try {
                setCarregandoLoja(true);
                setErroLoja('');
                const resposta = await axios.get(`http://localhost:3000/store/${slug}`);
                setStore(resposta.data.store);
            } catch (erro) {
                console.error('Erro ao buscar dados da loja:', erro);
                setErroLoja('Não foi possível carregar as informações da loja.');
            } finally {
                setCarregandoLoja(false);
            }
        }
        if (slug) getStore();
    }, [slug]);

    useEffect(() => {
        async function getProducts() {
            try {
                setCarregandoProdutos(true);
                let url = `http://localhost:3000/${slug}/products?page=${paginaAtual}&limit=8`;
                if (termoBusca.trim()) {
                    url += `&search=${encodeURIComponent(termoBusca.trim())}`;
                }
                const resposta = await axios.get(url);
                setProdutos(resposta.data.docs || []);
                setTotalPages(resposta.data.totalPages || 1);
                setTotalProdutos(resposta.data.totalDocs || 0);
            } catch (erro) {
                console.error('Erro ao buscar produtos:', erro);
            } finally {
                setCarregandoProdutos(false);
            }
        }
        if (slug) getProducts();
    }, [slug, paginaAtual, termoBusca]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        setTermoBusca(searchInput);
    };

    if (carregandoLoja) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-cyan-50/30 gap-3">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600 animate-pulse">Carregando dados da vitrine...</p>
            </div>
        );
    }

    if (erroLoja) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cyan-50/30 text-center">
                <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl max-w-md w-full shadow-sm">
                    <p className="text-rose-600 font-semibold mb-1">{erroLoja}</p>
                    <p className="text-xs text-slate-400 font-mono mt-2">Slug buscado: {slug}</p>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cyan-50/30">
                <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm max-w-md">
                    <h2 className="text-lg font-bold text-slate-800">Loja não encontrada</h2>
                    <p className="text-sm text-slate-500 mt-1">Verifique se o endereço está correto ou tente novamente mais tarde.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-cyan-50/20 py-8 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Cabeçalho */}
                <StoreHeader store={store} />

                {/* Grid de Produtos (Passando a função de adicionar ao carrinho) */}
                <GridProducts
                    produtos={produtos}
                    carregando={carregandoProdutos}
                    termoBusca={termoBusca}
                    totalProdutos={totalProdutos}
                    totalPages={totalPages}
                    paginaAtual={paginaAtual}
                    setPaginaAtual={setPaginaAtual}
                    handleSearchSubmit={handleSearchSubmit}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onAddToCart={handleAddToCart}
                />

                {/* Componente Flutuante do Carrinho */}
                <Cart
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    storeId={store?._id || store?.id}
                />

            </div>
        </main>
    );
}