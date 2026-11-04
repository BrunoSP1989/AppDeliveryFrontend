"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import OrderReceipt, { RECEIPT_CSS, PAPER_WIDTH_MM } from "./OrderReceipt";

export default function PrintOrderButton({ order, motoboys = [], store }) {
    const [printing, setPrinting] = useState(false);
    const receiptRef = useRef(null);

    const handlePrint = () => {
        setPrinting(true);

        // Aguarda o React renderizar o cupom oculto para copiarmos o HTML dele
        setTimeout(() => {
            const content = receiptRef.current?.innerHTML;
            if (!content) {
                setPrinting(false);
                return;
            }

            // Cria um iframe isolado (não sofre interferência do CSS/Tailwind do painel)
            const iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Pedido</title>
                    <style>
                        @page {
                            /* Define apenas a largura e deixa o corte automático pelo driver */
                            size: ${PAPER_WIDTH_MM}mm auto;
                            margin: 0mm;
                        }
                        html, body {
                            width: ${PAPER_WIDTH_MM}mm;
                            margin: 0 !important;
                            padding: 0 !important;
                            height: auto !important;
                            min-height: 0 !important;
                            background: #fff;
                        }
                        ${RECEIPT_CSS}
                    </style>
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `);
            doc.close();

            // Aguarda o carregamento do iframe e dispara a impressão
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // Remove o iframe após a janela de impressão fechar
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    setPrinting(false);
                }, 1000);
            }, 250);
        }, 100);
    };

    return (
        <>
            <button
                type="button"
                onClick={handlePrint}
                disabled={printing}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
                title="Imprimir cupom do pedido"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                </svg>
                {printing ? "Imprimindo..." : "Imprimir"}
            </button>

            {/* Renderiza oculto apenas por 100ms para extrair o HTML do componente React */}
            {printing &&
                createPortal(
                    <div ref={receiptRef} style={{ display: "none" }}>
                        <OrderReceipt order={order} motoboys={motoboys} store={store} />
                    </div>,
                    document.body
                )}
        </>
    );
}