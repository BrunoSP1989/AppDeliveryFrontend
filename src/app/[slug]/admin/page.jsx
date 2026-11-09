"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import GridProducts from "../../../components/GridProducts";
import GridOrders from "../../../components/GridOrders";
import GridMotoboys from "../../../components/GridMotoboys"; // <--- Importando o componente de motoboys
import AdminSidebar from "../../../components/AdminSidebar";
import api from "../../../lib/api";
import { useAuth } from '../../context/AuthContext';

export default function AdminStorePage() {
    const { user, loading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug;

    const [store, setStore] = useState(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersTotalPages, setOrdersTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [activeSection, setActiveSection] = useState("produtos");
    const [motoboys, setMotoboys] = useState([]);
    const [loadingMotoboys, setLoadingMotoboys] = useState(false); // <--- Adicionado estado de loading para motoboys

    // Proteção de rota
    useEffect(() => {
        if (!loading && !user) {
            router.replace(`/${slug}/admin/login`);
        }
    }, [loading, user, router, slug]);

    // 1º useEffect: Fetch Store Data
    useEffect(() => {
        async function fetchStore() {
            try {
                setLoadingStore(true);
                const response = await api.get(`store/${slug}`);
                setStore(response.data.store);
            } catch (error) {
                toast.error("Não foi possível carregar as informações da loja.");
            } finally {
                setLoadingStore(false);
            }
        }
        if (slug) fetchStore();
    }, [slug]);

    // 2º useEffect: Fetch Products
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoadingProducts(true);
                let productsUrl = `/${slug}/products?page=${currentPage}&limit=12`;
                if (searchTerm.trim() !== "") {
                    productsUrl += `&search=${encodeURIComponent(searchTerm.trim())}`;
                }
                const response = await api.get(productsUrl);
                setProducts(response.data.docs || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalProducts(response.data.totalDocs || 0);
            } catch (error) {
                toast.error("Erro ao carregar os produtos.");
                setProducts([]);
                setTotalPages(1);
                setTotalProducts(0);
            } finally {
                setLoadingProducts(false);
            }
        }
        if (slug) fetchProducts();
    }, [slug, currentPage, searchTerm]);

    // 3º useEffect: Fetch Orders
    useEffect(() => {
        async function fetchOrders() {
            try {
                setLoadingOrders(true);
                const response = await api.get(
                    `get-orders/?page=${ordersPage}&limit=10`
                );

                setOrders(response.data.docs || []);
                setOrdersTotalPages(response.data.totalPages || 1);
                setTotalOrders(response.data.totalDocs || 0);
            } catch (error) {
                if (error.response?.status !== 404) {
                    toast.error("Erro ao carregar os pedidos.");
                }
                setOrders([]);
                setOrdersTotalPages(1);
                setTotalOrders(0);
            } finally {
                setLoadingOrders(false);
            }
        }
        if (user) fetchOrders();
    }, [user, ordersPage]);

    // 4º useEffect: Fetch Motoboys
    useEffect(() => {
        async function fetchMotoboys() {
            try {
                setLoadingMotoboys(true); // <--- Ativa o loading
                const response = await api.get(`${slug}/motoboys`);
                setMotoboys(response.data.motoboys || response.data || []);
            } catch (error) {
                if (error.response?.status !== 404) {
                    toast.error("Erro ao carregar os entregadores.");
                }
                setMotoboys([]);
            } finally {
                setLoadingMotoboys(false); // <--- Desativa o loading
            }
        }
        if (user) fetchMotoboys();
    }, [user, slug]);

    function handleSearchSubmit(event) {
        event.preventDefault();
        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    }

    function openProductModal(product) {
        setSelectedProduct(product);
        setSelectedFile(null);
    }

    function closeProductModal() {
        setSelectedProduct(null);
        setSelectedFile(null);
    }

    async function handleUploadPhoto(e) {
        e.preventDefault();
        if (!selectedFile) {
            toast.warning("Selecione uma imagem primeiro.");
            return;
        }

        if (!user) {
            toast.error("Sua sessão expirou. Faça login novamente.");
            return;
        }

        try {
            setUploading(true);

            const responseUrl = await api.post('/upload/presigned-url', {
                idProduto: selectedProduct.idProduto || selectedProduct._id,
                fileType: selectedFile.type
            });

            const { uploadUrl, fileUrl } = responseUrl.data;

            await axios.put(uploadUrl, selectedFile, {
                headers: { "Content-Type": selectedFile.type }
            });

            await api.patch('/photo', {
                idProduto: selectedProduct.idProduto || selectedProduct._id,
                fotoUrl: fileUrl
            });

            toast.success("Foto atualizada com sucesso!");

            setProducts((prev) =>
                prev.map((p) =>
                    (p._id === selectedProduct._id || p.idProduto === selectedProduct.idProduto)
                        ? { ...p, fotoUrl: fileUrl, imageUrl: fileUrl }
                        : p
                )
            );

            closeProductModal();
        } catch (error) {
            console.error("Erro no upload:", error);
            toast.error(error.response?.data?.message || "Erro ao enviar a foto. Tente novamente.");
        } finally {
            setUploading(false);
        }
    }

    async function handleAssignMotoboy(orderId, motoboyId) {
        if (!user) {
            toast.error("Sua sessão expirou. Faça login novamente.");
            return;
        }
        const currentOrder = orders.find((o) => o._id === orderId);
        if (currentOrder && currentOrder.motoboyId) {
            toast.warning("Este pedido já possui um entregador vinculado e não pode ser alterado.");
            return;
        }

        try {
            const { data } = await api.patch(`/orders/${orderId}/motoboy`, { motoboyId });

            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId ? { ...o, motoboyId: data.order.motoboyId, status: data.order.status } : o
                )
            );

            toast.success("Entregador vinculado ao pedido!");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Erro ao vincular o entregador."
            );
        }
    }

    const menuItems = [
        { id: "produtos", label: "Produtos", icon: "produtos", badge: totalProducts },
        { id: "pedidos", label: "Pedidos", icon: "pedidos", badge: totalOrders },
        { id: "motoboys", label: "Motoboys", icon: "motoboys", badge: motoboys.length },
    ];

    if (loadingStore || loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-500 border-t-transparent" />
                <p className="text-sm font-medium text-slate-600">Carregando painel admin...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 lg:flex">
            <AdminSidebar
                storeName={store?.fantasia || slug}
                items={menuItems}
                active={activeSection}
                onSelect={setActiveSection}
            />

            <main className="relative min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">

                    {/* Header Admin */}
                    <header className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50/50 p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                                    {activeSection === "produtos" && "Produtos"}
                                    {activeSection === "pedidos" && "Pedidos"}
                                    {activeSection === "motoboys" && "Motoboys"}
                                </h1>
                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                    <span>
                                        {activeSection === "produtos" && "Gerenciando catálogo da loja"}
                                        {activeSection === "pedidos" && "Acompanhando pedidos da loja"}
                                        {activeSection === "motoboys" && "Gerenciando entregadores cadastrados"}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                    <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                                        {store?.fantasia || slug}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Seção: Produtos */}
                    {activeSection === "produtos" && (
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
                            onAddToCart={openProductModal}
                            buttonLabel="Editar"
                        />
                    )}

                    {/* Seção: Pedidos */}
                    {activeSection === "pedidos" && (
                        <GridOrders
                            orders={orders}
                            loading={loadingOrders}
                            totalOrders={totalOrders}
                            currentPage={ordersPage}
                            totalPages={ordersTotalPages}
                            setCurrentPage={setOrdersPage}
                            motoboys={motoboys}
                            onAssignMotoboy={handleAssignMotoboy}
                            store={store}
                        />
                    )}

                    {/* Seção: Motoboys */}
                    {activeSection === "motoboys" && (
                        <GridMotoboys
                            motoboys={motoboys}
                            loading={loadingMotoboys}
                        />
                    )}
                </div>

                {/* Modal de Visualização e Upload de Foto */}
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-bold text-slate-800">Detalhes do Produto</h2>
                                <button onClick={closeProductModal} className="text-slate-400 hover:text-slate-600">
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500">Nome do Produto</p>
                                    <p className="text-slate-800">{selectedProduct.descricao}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-500">Descrição</p>
                                    <p className="text-slate-700 text-sm">
                                        {selectedProduct.description || "Nenhuma descrição disponível."}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-800">Preço de Venda</p>
                                    <p className="text-slate-700 text-sm">{selectedProduct.precoVenda}</p>
                                </div>

                                <div className="border-t border-slate-200 pt-4 mt-4">
                                    <h3 className="text-sm font-bold text-slate-800 mb-2">Atualizar Foto</h3>
                                    <form onSubmit={handleUploadPhoto} className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                            className="w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                        />

                                        <button
                                            type="submit"
                                            disabled={uploading || !selectedFile}
                                            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading ? "Enviando..." : "Salvar Foto"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}