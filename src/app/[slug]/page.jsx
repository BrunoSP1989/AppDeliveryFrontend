"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import StoreHeader from "../../components/StoreHeader";
import GridProducts from "../../components/GridProducts";
import Cart from "../../components/Cart";

export default function StorePage() {
    const params = useParams();
    const slug = params?.slug;

    const [store, setStore] = useState(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const [storeError, setStoreError] = useState("");

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    // 1º useEffect: Fetch Store Data
    useEffect(() => {
        async function fetchStore() {
            try {
                setLoadingStore(true);
                setStoreError("");

                const response = await axios.get(
                    `http://localhost:3000/store/${slug}`
                );
                setStore(response.data.store);
            } catch (error) {
                const errorMsg = "Não foi possível carregar as informações da loja.";
                setStoreError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setLoadingStore(false);
            }
        }

        if (slug) {
            fetchStore();
        } else {
            setLoadingStore(true);
        }
    }, [slug]);

    // 2º useEffect: Fetch Products Catalog
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoadingProducts(true);

                let productsUrl = `http://localhost:3000/${slug}/products?page=${currentPage}&limit=12`;

                if (searchTerm.trim() !== "") {
                    productsUrl += `&search=${encodeURIComponent(searchTerm.trim())}`;
                }

                const response = await axios.get(productsUrl);

                setProducts(response.data.docs || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalProducts(response.data.totalDocs || 0);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                toast.error("Erro ao carregar o catálogo de produtos. Tente novamente mais tarde.");

                setProducts([]);
                setTotalPages(1);
                setTotalProducts(0);
            } finally {
                setLoadingProducts(false);
            }
        }

        if (slug) {
            fetchProducts();
        }
    }, [slug, currentPage, searchTerm]);

    function handleAddToCart(product) {
        const productId = product._id;

        // Faz a verificação FORA do cálculo de estado
        const productExists = cartItems.some(
            (item) => item._id === productId
        );

        if (!productExists) {
            toast.success("Produto adicionado ao carrinho!");
        }

        setCartItems((items) => {
            if (!productExists) {
                // Modificado 'quantidade' para 'quantity' para padronizar
                return [...items, { ...product, quantity: 1 }];
            }

            return items.map((item) =>
                item._id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        });
    }

    function handleUpdateQuantity(id, newQty) {
        if (newQty <= 0) {
            handleRemoveItem(id);
            return;
        }

        setCartItems((items) =>
            items.map((item) =>
                item._id === id
                    ? { ...item, quantity: newQty }
                    : item
            )
        );
    }

    function handleRemoveItem(id) {
        setCartItems((items) =>
            items.filter((item) => item._id !== id)
        );
        toast.info("Item removido do carrinho.");
    }

    function handleClearCart() {
        setCartItems([]);
    }

    function handleSearchSubmit(event) {
        event.preventDefault();

        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    }

    if (loadingStore) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cyan-50/30">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <p className="text-sm font-medium text-slate-600">
                    Carregando dados da vitrine...
                </p>
            </div>
        );
    }

    if (storeError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-cyan-50/30 p-4 text-center">
                <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6">
                    <p className="font-semibold text-rose-600">
                        {storeError}
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
                    products={products}
                    loading={loadingProducts}
                    searchTerm={searchTerm}
                    totalProducts={totalProducts}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
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