
const money = (v) =>
  typeof v === "number"
    ? v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : v ?? "-";

export const PAPER_WIDTH_MM = 80;

export const RECEIPT_CSS = `
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: auto;
  }

  .receipt {
    width: 72mm;
    padding: 2mm;
    font-family: "Lucida Console", "Courier New", monospace;
    font-size: 11px;
    color: #000;
    font-weight: 400;
    line-height: 1.25;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* CABEÇALHO */
  .receipt h1 {
    font-size: 13px;
    text-align: center;
    margin: 0 0 3px;
    font-weight: 700;
  }

  .receipt .center {
    text-align: center;
  }

  /* SEPARADORES */
  .receipt .sep {
    border-top: 1px dotted #000;
    margin: 4px 0;
  }

  /* LINHAS */
  .receipt .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 5px;
    margin: 2px 0;
    font-weight: 400;
  }

  /* PEDIDO */
  .receipt .order-title {
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    margin: 5px 0;
  }

  /* CLIENTE */
  .receipt .customer-info {
    font-weight: 600;
    line-height: 1.4;
  }

  /* ITENS */
  .receipt .items-title {
    font-size: 11px;
    font-weight: 700;
    margin: 3px 0;
  }

  .receipt .item-row {
    font-size: 11px;
    font-weight: 400;
    color: #000;
    line-height: 1.3;
    margin: 2px 0;
  }

  .receipt .item-row .description {
    flex: 1;
    min-width: 0;
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  /* PREÇOS */
  .receipt .item-row .price {
    white-space: nowrap;
    font-weight: 700;
    text-align: right;
  }

  /* TOTAL */
  .receipt .total {
    font-size: 13px;
    font-weight: 700;
  }

  .receipt .label {
    font-weight: 700;
  }

  /* RODAPÉ */
  .receipt .footer {
    text-align: center;
    font-size: 10px;
    font-weight: 400;
    margin-top: 5px;
  }
`;

export default function OrderReceipt({ order, motoboys = [], store = {} }) {
  const c = order.client || {};
  const storeData = store || {};

  const shortId = String(order._id || "").slice(-6).toUpperCase();

  const assignedId = order.motoboyId?._id || order.motoboyId || "";

  const motoboyName =
    motoboys.find((m) => m._id === assignedId)?.name ||
    order.motoboyId?.name ||
    "";

  const cidade = c.cidade ? (c.estado ? `${c.cidade}/${c.estado}` : c.cidade) : "-";

  return (
    <div className="receipt">
      {/* CABEÇALHO */}
      <div className="center">
        <div className="label">{storeData.fantasia || "Loja"}</div>

        {storeData.cnpj && <div>CNPJ: {storeData.cnpj}</div>}

        {storeData.telefone && <div>Tel: {storeData.telefone}</div>}

        {storeData.address && <div>{storeData.address}</div>}
      </div>

      <div className="sep" />

      {/* IDENTIFICAÇÃO DO PEDIDO */}
      <div className="order-title">PEDIDO #{shortId}</div>

      <div className="center">
        {order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "-"}
      </div>

      <div className="sep" />

      {/* DADOS DO CLIENTE */}
      <div className="customer-info">
        <div>Cliente: {c.nome || "Não informado"}</div>

        <div>Tel: {c.telefone || "-"}</div>

        <div>
          End: {c.endereco || "-"}, {c.numero || "S/N"}
        </div>

        <div>Bairro: {c.bairro || "-"}</div>

        <div>Cidade: {cidade}</div>
      </div>

      <div className="sep" />

      {/* PRODUTOS */}
      <div className="items-title">ITENS</div>

      {order.items?.length ? (
        order.items.map((item, i) => (
          <div className="row item-row" key={item.idProduto || i}>
            <span className="description">
              {item.quantidade}x {item.descricao}
            </span>

            {typeof item.precoVenda === "number" && (
              <span className="price">{money(item.precoVenda * item.quantidade)}</span>
            )}
          </div>
        ))
      ) : (
        <div className="item-row">Sem itens.</div>
      )}

      <div className="sep" />

      {/* TOTAL */}
      <div className="row total">
        <span>TOTAL</span>
        <span>{money(order.total)}</span>
      </div>

      {/* ENTREGADOR */}
      {motoboyName && (
        <>
          <div className="sep" />

          <div className="customer-info">Entregador: {motoboyName}</div>
        </>
      )}

      <div className="sep" />

      {/* RODAPÉ */}
      <div className="footer">Obrigado pela preferência!</div>
    </div>
  );
}
