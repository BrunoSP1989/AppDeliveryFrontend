
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import StoreHeader from "../../components/StoreHeader";
import GridProducts from "../../components/GridProducts";
import Cart from "../../components/Cart";

export default function PaginaLoja() {
    const params = useParams();
    const slug = params?.slug;
    const [store, setStore] = useState(null);
    const [carregandoLoja, setCarregandoLoja] = useState(true);
    const [erroLoja, setErroLoja] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [carregandoProdutos, setCarregandoProdutos] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        async function getStore() {
            try {
                setCarregandoLoja(true);
                setErroLoja("");

                const resposta = await axios.get(
                    `http://localhost:3000/store/${slug}`
                );
                setStore(resposta.data.store);
            } catch (erro) {
                setErroLoja("Não foi possível carregar as informações da loja.");
            } finally {
                setCarregandoLoja(false);
            }
        }

        if (slug) {
            getStore();
        }
        else {
            setCarregandoLoja(true);
        }

    }, [slug]);

    useEffect(() => {
        async function getProducts() {
            try {
                setCarregandoProdutos(true);

                let urlProducts = `http://localhost:3000/${slug}/products?page=${paginaAtual}&limit=12`;

                if (searchItem.trim() !== "") {
                    urlProducts += `&search=${encodeURIComponent(searchItem.trim())}`;
                }

                const resposta = await axios.get(urlProducts);

                setProdutos(resposta.data.docs || []);
                setTotalPages(resposta.data.totalPages || 1);
                setTotalProdutos(resposta.data.totalDocs || 0);
            } catch (erro) {
                console.log(erro);
                setProdutos([]);
                setTotalPages(1);
                setTotalProdutos(0);
            } finally {
                setCarregandoProdutos(false);
            }
        }

        if (slug) {
            getProducts();
        }
    }, [slug, paginaAtual, searchItem]);

    function handleAddToCart(products) {
        const idProduto = products._id;

        setCartItems((itens) => {
            const produtoExiste = itens.some(
                (item) => item._id === idProduto
            );

            if (!produtoExiste) {
                return [...itens, { ...products, quantidade: 1 }];
            }

            return itens.map((item) =>
                item._id === idProduto
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            );
        });
    }

    function handleUpdateQuantity(id, newQtd) {
        if (newQtd <= 0) {
            handleRemoveItem(id);
            return;
        }

        setCartItems((itens) =>
            itens.map((item) =>
                item._id === id
                    ? { ...item, quantidade: newQtd }
                    : item
            )
        );
    }

    function handleRemoveItem(id) {
        setCartItems((itens) =>
            itens.filter((item) => item._id !== id)
        );
    }

    function handleClearCart() {
        setCartItems([]);
    }

    function handleSearchSubmit(event) {
        event.preventDefault();

        setPaginaAtual(1);
        setSearchItem(searchInput.trim());
    }

    if (carregandoLoja) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cyan-50/30">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

                <p className="text-sm font-medium text-slate-600">
                    Carregando dados da vitrine...
                </p>
            </div>
        );
    }

    if (erroLoja) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cyan-50/30 p-4 text-center">
                <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6">
                    <p className="font-semibold text-rose-600">
                        {erroLoja}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                        Loja pesquisada: {slug}
                    </p>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cyan-50/30 p-4">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <h2 className="text-lg font-bold text-slate-800">
                        Loja não encontrada
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Verifique se o endereço está correto ou tente novamente.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-cyan-50/20 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

                <StoreHeader store={store} />

                <GridProducts
                    produtos={produtos}
                    carregando={carregandoProdutos}
                    searchItem={searchItem}
                    totalProdutos={totalProdutos}
                    totalPages={totalPages}
                    paginaAtual={paginaAtual}
                    setPaginaAtual={setPaginaAtual}
                    handleSearchSubmit={handleSearchSubmit}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onAddToCart={handleAddToCart}
                />

                <Cart
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    storeId={store.id}
                />

            </div>
        </main>
    );
}
