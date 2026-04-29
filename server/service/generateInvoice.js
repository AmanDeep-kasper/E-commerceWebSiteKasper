import puppeteer from "puppeteer";

function formatCurrency(val) {
  return `₹${Number(val).toFixed(2)}`;
}

export function generateInvoiceHTML(invoice) {
  const formatDate = (dateVal) => {
    const d = new Date(dateVal);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const fmt = (num) =>
    Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const itemRows = invoice.items
    .map((item, i) => {
      const taxType =
        invoice.taxType === "IGST"
          ? `<td class="center" style="font-size:10px">IGST</td>`
          : `<td class="center" style="font-size:10px">CGST<br/>SGST</td>`;

      const taxRate =
        invoice.taxType === "IGST"
          ? `<td class="center" style="font-size:10px">${item.igstRate}%</td>`
          : `<td class="center" style="font-size:10px">${item.cgstRate}%<br/>${item.sgstRate}%</td>`;

      return `
      <tr>
        <td class="center">${i + 1}.</td>
        <td>
          ${item.productTitle}
          ${item.variantName ? `<br/><span style="font-size:10px;color:#555">Variant: ${item.variantName}${item.variantColor ? " | " + item.variantColor : ""}${item.sku ? " | SKU: " + item.sku : ""}</span>` : ""}
        </td>
        <td class="right">₹${fmt(item.sellingPrice)}</td>
        <td class="center">${item.quantity}</td>
        <td class="right">₹${fmt(item.taxableAmount)}</td>
        ${taxRate}
        ${taxType}
        <td class="right">₹${fmt(item.totalTax)}</td>
        <td class="right">₹${fmt(item.lineTotal)}</td>
      </tr>
    `;
    })
    .join("");

  const shippingRow = `
    <tr>
      <td class="center">${invoice.items.length + 1}.</td>
      <td>Shipping</td>
      <td class="right">₹${fmt(invoice.summary.shippingCharge)}</td>
      <td class="center">1</td>
      <td class="right">₹${fmt(invoice.summary.shippingCharge)}</td>
      <td class="center">0%</td>
      <td class="center">N/A</td>
      <td class="right">₹0</td>
      <td class="right">₹${fmt(invoice.summary.shippingCharge)}</td>
    </tr>
  `;

  const totalTaxAll = fmt(invoice.summary.totalTax);
  const grandTotal = fmt(invoice.summary.grandTotal);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      padding: 24px;
      color: #000;
      background: #fff;
    }

    .container {
      border: 2px solid #000;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    /* HEADER */
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #ccc;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-logo {
      width: 38px;
      height: 38px;
      background: #e84393;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      font-weight: bold;
      color: white;
      text-align: center;
      line-height: 1.3;
      font-family: Arial, sans-serif;
    }

    .brand-name {
      font-size: 15px;
      font-weight: bold;
      color: #cc3333;
      font-family: Arial, sans-serif;
    }

    .inv-title {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 1px;
      font-family: Arial, sans-serif;
    }

    /* TWO COLUMN SECTION */
    .two-col {
      display: flex;
      border: 1px solid #ccc;
      margin-top: 12px;
    }

    .col {
      width: 50%;
      padding: 10px 12px;
    }

    .col:first-child {
      border-right: 1px solid #ccc;
    }

    .col-header {
      font-weight: bold;
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 6px;
      margin-bottom: 8px;
      font-family: Arial, sans-serif;
    }

    .field {
      margin: 4px 0;
      line-height: 1.5;
    }

    /* SHIPPING */
    .shipping-section {
      border: 1px solid #ccc;
      border-top: none;
      padding: 10px 12px;
    }

    .section-header {
      font-weight: bold;
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding-bottom: 6px;
      margin-bottom: 8px;
      font-family: Arial, sans-serif;
    }

    /* ITEMS TABLE */
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 11.5px;
    }

    table.items-table th,
    table.items-table td {
      border: 1px solid #ccc;
      padding: 5px 6px;
    }

    table.items-table th {
      background: #f3f3f3;
      font-weight: bold;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 11px;
    }

    .right  { text-align: right; }
    .center { text-align: center; }

    /* TOTALS TABLE */
    table.totals-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0;
      font-size: 12px;
    }

    table.totals-table td {
      border: 1px solid #ccc;
      padding: 5px 8px;
    }

    .totals-table .label-cell {
      font-weight: bold;
      text-align: left;
      background: #f9f9f9;
    }

    /* TOTAL FOOTER ROW in items table */
    .total-footer td {
      background: #f3f3f3;
      font-weight: bold;
    }

    /* AMOUNT IN WORDS */
    .amount-words {
      margin-top: 12px;
      font-size: 12px;
      line-height: 1.6;
    }

    /* SIGNATURE */
    .footer {
      margin-top: 28px;
      text-align: right;
      font-size: 12px;
    }

    .sig-line {
      display: inline-block;
      border-top: 1px solid #000;
      min-width: 180px;
      padding-top: 4px;
      margin-top: 8px;
    }
  </style>
</head>
<body>
<div class="container">

  <!-- HEADER -->
  <div class="top">
    <div class="brand-row">
      <div class="brand-logo">HAS</div>
      <span class="brand-name">${invoice.seller.fullName}</span>
    </div>
    <div class="inv-title">TAX INVOICE</div>
  </div>

  <!-- SELLER + INVOICE DETAILS -->
  <div class="two-col">
    <div class="col">
      <div class="col-header">Sold by</div>
      <div class="field">Name: <strong>${invoice.seller.fullName}</strong></div>
      <div class="field">Address: ${invoice.seller.addressLine1},<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${invoice.seller.city}, ${invoice.seller.state} - ${invoice.seller.pinCode}, ${invoice.seller.country}</div>
      <div class="field">Phone No.: <strong>+91 ${invoice.seller.phone}</strong></div>
      <div class="field">Email: <strong>${invoice.seller.email}</strong></div>
      <div class="field">GSTIN: <strong>${invoice.seller.gstin || "-"}</strong></div>
    </div>
    <div class="col">
      <div class="col-header">Invoice Details</div>
      <div class="field">Invoice No.: <strong>${invoice.invoiceNumber}</strong></div>
      <div class="field">Invoice Date: <strong>${formatDate(invoice.issuedAt)}</strong></div>
      <div class="field">Order ID: <strong>${invoice.orderNumber}</strong></div>
      <div class="field">Order Date: <strong>${formatDate(invoice.issuedAt)}</strong></div>
      <div class="field">Payment Status: <strong>${invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}</strong></div>
    </div>
  </div>

  <!-- SHIPPING ADDRESS -->
  <div class="shipping-section">
    <div class="section-header">Shipping Address</div>
    <div class="field">Name: <strong>${invoice.buyer.fullName}</strong></div>
    <div class="field">Address: ${invoice.buyer.addressLine1}, ${invoice.buyer.city}, ${invoice.buyer.state} - ${invoice.buyer.pinCode}</div>
    <div class="field">Phone No.: <strong>+91 ${invoice.buyer.phone}</strong></div>
  </div>

  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width:40px">S. No.</th>
        <th>Product Description</th>
        <th style="width:72px">Unit Price</th>
        <th style="width:36px">QTY</th>
        <th style="width:82px">Net Amount</th>
        <th style="width:52px">Tax Rate</th>
        <th style="width:55px">Tax Type</th>
        <th style="width:76px">Tax Amount</th>
        <th style="width:72px">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
      ${shippingRow}
      <tr class="total-footer">
        <td colspan="7" class="label-cell">Total</td>
        <td class="right">₹${totalTaxAll}</td>
        <td class="right">₹${grandTotal}</td>
      </tr>
    </tbody>
  </table>

  <!-- AMOUNT IN WORDS -->
  <div class="amount-words">
    <strong>Amount in words:</strong><br/>
    ${invoice.summary.amountInWords}
  </div>

  <!-- SIGNATURE -->
  <div class="footer">
    <strong>${invoice.seller.fullName}</strong>
    <div class="sig-line">Authorized Signatory</div>
  </div>

</div>
</body>
</html>`;
}

let browser;

export const getBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browser;
};

export const generateInvoicePDF = async (invoice) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    const html = generateInvoiceHTML(invoice);

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "10mm",
        bottom: "15mm",
        left: "10mm",
      },
    });

    return buffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  } finally {
    await page.close(); // IMPORTANT
  }
};
