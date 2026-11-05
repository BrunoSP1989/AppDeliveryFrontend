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
    padding: 3mm 3mm 8mm;
    font-family: "Lucida Console", "Courier New", monospace;
    font-size: 12px;
    color: #000;
    font-weight: 400;
    line-height: 1.35;
    overflow-wrap: anywhere;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .receipt .center {
    text-align: center;
  }

  /* ---------- CABEÇALHO DA LOJA ---------- */
  .receipt .store {
    text-align: center;
    padding-bottom: 6px;
    border-bottom: 2px solid #000;
    font-size: 10px;
    line-height: 1.5;
  }

  .receipt .store .label {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    line-height: 1.2;
    margin-bottom: 3px;
  }

  /* ---------- BLOCO DO PEDIDO (preto invertido) ---------- */
  .receipt .order-box {
    background: #000;
    color: #fff;
    text-align: center;
    padding: 7px 4px 6px;
    margin: 8px 0 8px;
  }

  .receipt .order-title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 3px;
    line-height: 1.2;
    margin: 0;
  }

  .receipt .order-date {
    font-size: 10px;
    letter-spacing: 1px;
    margin-top: 3px;
  }

  /* ---------- CLIENTE (caixa com borda) ---------- */
  .receipt .customer-info {
    border: 1px solid #000;
    padding: 5px 6px;
  }

  .receipt .info-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 3px 0;
  }

  .receipt .info-label {
    flex: 0 0 15mm;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .receipt .info-value {
    flex: 1;
    min-width: 0;
    font-size: 12px;
  }

  /* nome do cliente e endereço ganham destaque */
  .receipt .info-row.client-name .info-value {
    font-size: 14px;
    font-weight: 700;
  }

  .receipt .info-row.address .info-value {
    font-weight: 700;
  }

  /* ---------- ITENS ---------- */
  .receipt .items-title {
    background: #000;
    color: #fff;
    text-align: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 4px;
    padding: 3px 0;
    margin: 10px 0 0;
  }

  .receipt .items-head,
  .receipt .item-row {
    display: grid;
    grid-template-columns: 10mm 1fr 20mm;
    column-gap: 6px;
    align-items: start;
  }

  .receipt .items-head {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 0 3px;
    border-bottom: 1px solid #000;
  }

  .receipt .items-head span:last-child {
    text-align: right;
  }

  .receipt .item-row {
    padding: 6px 0;
    margin: 0;
    border-bottom: 1px dotted #000;
    line-height: 1.3;
  }

  .receipt .item-row:last-of-type {
    border-bottom: 1px solid #000;
  }

  .receipt .item-row .qty {
    font-size: 13px;
    font-weight: 700;
  }

  .receipt .item-row .description {
    min-width: 0;
    font-size: 12px;
  }

  .receipt .item-row .price {
    grid-column: 3;
    white-space: nowrap;
    font-weight: 700;
    text-align: right;
  }

  /* ---------- TOTAL (bloco preto invertido) ---------- */
  .receipt .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }

  .receipt .total {
    background: #000;
    color: #fff;
    margin: 10px 0 0;
    padding: 8px 6px;
    font-size: 16px;
    font-weight: 700;
  }

  .receipt .total span:first-child {
    font-size: 12px;
    letter-spacing: 3px;
  }

  /* ---------- ENTREGADOR ---------- */
  .receipt .courier-box {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 4px;
    margin-top: 10px;
    padding: 6px 6px;
    border: 1px dashed #000;
  }

  .receipt .courier-box .label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .receipt .courier-box .name {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
  }

  /* ---------- RODAPÉ ---------- */
  .receipt .footer {
    margin-top: 12px;
    padding-top: 6px;
    border-top: 2px solid #000;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
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
      <div className="store">
        <div className="label">{storeData.fantasia || "Loja"}</div>

        {storeData.cnpj && <div>CNPJ: {storeData.cnpj}</div>}

        {storeData.telefone && <div>Tel: {storeData.telefone}</div>}

        {storeData.address && <div>{storeData.address}</div>}
      </div>

      {/* IDENTIFICAÇÃO DO PEDIDO */}
      <div className="order-box">
        <div className="order-title">PEDIDO #{shortId}</div>

        <div className="order-date">
          {order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "-"}
        </div>
      </div>

      {/* DADOS DO CLIENTE */}
      <div className="customer-info">
        <div className="info-row client-name">
          <span className="info-label">Cliente:</span>
          <span className="info-value">{c.nome || "Não informado"}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Tel:</span>
          <span className="info-value">{c.telefone || "-"}</span>
        </div>

        <div className="info-row address">
          <span className="info-label">End:</span>
          <span className="info-value">
            {c.endereco || "-"}, {c.numero || "S/N"}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Bairro:</span>
          <span className="info-value">{c.bairro || "-"}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Cidade:</span>
          <span className="info-value">{cidade}</span>
        </div>
      </div>

      {/* PRODUTOS */}
      <div className="items-title">ITENS</div>

      <div className="items-head">
        <span>QTD</span>
        <span>DESCRIÇÃO</span>
        <span>VALOR</span>
      </div>

      {order.items?.length ? (
        order.items.map((item, i) => (
          <div className="item-row" key={item.idProduto || i}>
            <span className="qty">{item.quantidade}x</span>

            <span className="description">{item.descricao}</span>

            {typeof item.precoVenda === "number" && (
              <span className="price">{money(item.precoVenda * item.quantidade)}</span>
            )}
          </div>
        ))
      ) : (
        <div className="item-row">Sem itens.</div>
      )}

      {/* TOTAL */}
      <div className="row total">
        <span>TOTAL</span>
        <span>{money(order.total)}</span>
      </div>

      {/* ENTREGADOR */}
      {motoboyName && (
        <div className="courier-box">
          <span className="label">Entregador:</span>
          <span className="name">{motoboyName}</span>
        </div>
      )}

      {/* RODAPÉ */}
      <div className="footer">Obrigado pela preferência!</div>
    </div>
  );
}