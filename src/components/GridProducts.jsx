export default function GridProducts({
    produtos,
    carregando,
    termoBusca,
    totalProdutos,
    totalPages,
    paginaAtual,
    setPaginaAtual,
    handleSearchSubmit,
    searchInput,
    setSearchInput,
    onAddToCart
}) {
    return (
        <section className="bg-white border border-slate-200/85 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Catálogo de Produtos</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Explore os itens disponíveis ({totalProdutos} encontrados).</p>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Buscar produto por descrição..."
                            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        />
                    </div>
                    {/* Botão de busca em Azul Piscina */}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-xl hover:bg-cyan-600 transition-colors shrink-0 shadow-sm"
                    >
                        Buscar
                    </button>
                </form>
            </div>

            {carregando ? (
                <div className="py-16 text-center">
                    <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-slate-500">Carregando produtos...</p>
                </div>
            ) : produtos.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50/50">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-sm font-medium text-slate-600">Nenhum produto encontrado.</p>
                    {termoBusca && (
                        <p className="text-xs text-slate-400 mt-1">Tente buscar por outro termo ou limpe a pesquisa.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {produtos.map((produto) => (
                        <div
                            key={produto._id || produto.id}
                            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="w-full h-40 bg-slate-50 border border-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 group-hover:bg-slate-100/80 transition-colors overflow-hidden">
                                    {produto.fotoUrl ? (
                                        <img src={produto.fotoUrl} alt={produto.descricao} className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="flex items-center gap-3 p-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-cyan-600 shrink-0">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 10l-4-2-4 2" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Sem foto
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">
                                    {produto.descricao}
                                </h3>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    {/* Preço com azul forte e tom leve */}
                                    <span className="text-base font-bold text-cyan-700">
                                        {produto.precoVenda ? `R$ ${Number(produto.precoVenda).toFixed(2)}` : 'Consulte'}
                                    </span>
                                    {produto.unidade && (
                                        <span className="text-[11px] text-slate-400 font-medium uppercase">
                                            Un: {produto.unidade}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onAddToCart && onAddToCart(produto)}
                                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button
                        onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                        disabled={paginaAtual === 1}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Página <strong className="text-slate-900">{paginaAtual}</strong> de <strong className="text-slate-900">{totalPages}</strong>
                    </span>
                    {/* Botão Próxima em verde suave */}
                    <button
                        onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPages))}
                        disabled={paginaAtual === totalPages}
                        className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </section>
    );
}