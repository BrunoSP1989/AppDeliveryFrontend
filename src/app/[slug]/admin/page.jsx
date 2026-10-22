"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import GridProducts from "../../../components/GridProducts";

export default function AdminStorePage() {
    const params = useParams();
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

    // 1º useEffect: Fetch Store Data
    useEffect(() => {
        async function fetchStore() {
            try {
                setLoadingStore(true);
                const response = await axios.get(`http://localhost:3000/store/${slug}`);
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
                let productsUrl = `http://localhost:3000/${slug}/products?page=${currentPage}&limit=12`;
                if (searchTerm.trim() !== "") {
                    productsUrl += `&search=${encodeURIComponent(searchTerm.trim())}`;
                }
                const response = await axios.get(productsUrl);
                setProducts(response.data.docs || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalProducts(response.data.totalDocs || 0); // Atualizando o total
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

    function handleSearchSubmit(event) {
        event.preventDefault();
        setCurrentPage(1);
        setSearchTerm(searchInput.trim());
    }

    // Funções do Admin
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

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("image", selectedFile);

            // Substitua pela sua rota real de upload no backend
            await axios.patch(`http://localhost:3000/products/${selectedProduct._id}/photo`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Foto atualizada com sucesso!");

            // Atualiza a lista de produtos localmente para refletir a nova imagem
            setProducts((prev) =>
                prev.map((p) => p._id === selectedProduct._id ? { ...p, imageUrl: URL.createObjectURL(selectedFile) } : p)
            );

            closeProductModal();
        } catch (error) {
            toast.error("Erro ao enviar a foto. Tente novamente.");
        } finally {
            setUploading(false);
        }
    }

    if (loadingStore) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-500 border-t-transparent" />
                <p className="text-sm font-medium text-slate-600">Carregando painel admin...</p>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header Admin */}
                <header className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                                Painel Administrativo
                            </h1>
                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                <span>Gerenciando catálogo da loja</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                                    {store?.fantasia || slug}
                                </span>
                            </div>
                        </div>

                        {/* Você pode colocar estatísticas rápidas aqui no futuro, como "X produtos cadastrados" */}
                    </div>
                </header>

                {/* Componente GridProducts inserido aqui */}
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
                    buttonLabel='Editar'
                />
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
                                <p className="text-slate-700 text-sm">{selectedProduct.description || "Nenhuma descrição disponível."}</p>
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
                                        accept="image/*"
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
    );
}