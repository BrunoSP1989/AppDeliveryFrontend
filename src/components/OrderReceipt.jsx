const money = (v) =>
    typeof v === "number"
        ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : v ?? "-";

export const PAPER_WIDTH_MM = 80; // use 58 para bobina de 58mm

export const RECEIPT_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; height: auto; }
  .receipt {
    width: 72mm; /* 80mm da bobina menos a margem física dos roletes da impressora */
    padding: 2mm;
    font-family: "Courier New", monospace;
    font-size: 12px;
    color: #000;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .receipt h1 { font-size: 15px; text-align: center; margin: 0 0 4px; }
  .receipt .center { text-align: center; }
  .receipt .sep { border-top: 1px dashed #000; margin: 6px 0; }
  .receipt .row { display: flex; justify-content: space-between; gap: 8px; margin: 2px 0; }
  .receipt .total { font-size: 14px; font-weight: bold; }
  .receipt .label { font-weight: bold; }
`;

export default function OrderReceipt({ order, motoboys = [], store = {} }) {
    const c = order.client || {};
    const storeData = store || {};
    const shortId = String(order._id || "").slice(-6).toUpperCase();

    const assignedId = order.motoboyId?._id || order.motoboyId || "";
    const motoboyName =
        motoboys.find((m) => m._id === assignedId)?.name || order.motoboyId?.name || "";

    const cidade = c.cidade ? (c.estado ? `${c.cidade}/${c.estado}` : c.cidade) : "-";

    return (
        <div className="receipt">
            <div className="center">
                <div className="label">{storeData.fantasia || "Loja"}</div>
                {storeData.cnpj && <div>CNPJ: {storeData.cnpj}</div>}
                {storeData.telefone && <div>Tel: {storeData.telefone}</div>}
                {storeData.address && <div>{storeData.address}</div>}
            </div>
            <div className="sep" />
            <h1>PEDIDO #{shortId}</h1>
            <div className="center">
                {order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "-"}
            </div>
            <div className="center">Status: {order.status || "-"}</div>

            <div className="sep" />
            <div><span className="label">Cliente:</span> {c.nome || "Não informado"}</div>
            <div><span className="label">Tel:</span> {c.telefone || "-"}</div>
            <div><span className="label">End:</span> {c.endereco || "-"}, {c.numero || "S/N"}</div>
            <div><span className="label">Bairro:</span> {c.bairro || "-"}</div>
            <div><span className="label">Cidade:</span> {cidade}</div>

            <div className="sep" />
            <div className="label">ITENS</div>
            {order.items?.length ? (
                order.items.map((item, i) => (
                    <div className="row" key={item.idProduto || i}>
                        <span>{item.quantidade}x {item.descricao}</span>
                        {typeof item.preco === "number" && (
                            <span>{money(item.preco * item.quantidade)}</span>
                        )}
                    </div>
                ))
            ) : (
                <div>Sem itens.</div>
            )}

            <div className="sep" />
            <div className="row total">
                <span>TOTAL</span>
                <span>{money(order.total)}</span>
            </div>

            {motoboyName && (
                <>
                    <div className="sep" />
                    <div><span className="label">Entregador:</span> {motoboyName}</div>
                </>
            )}

            <div className="sep" />
            <div className="center">Obrigado pela preferência!</div>
        </div>
    );
}