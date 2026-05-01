import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import env from "../config/env.js";

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

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const itemRows = invoice.items
    .map((item, i) => {
      const isIGST = invoice.taxType === "IGST";
      const taxRateCell = isIGST
        ? `<td class="c">${item.igstRate}%</td>`
        : `<td class="c">${item.cgstRate}%<br>${item.sgstRate}%</td>`;
      const taxTypeCell = isIGST
        ? `<td class="c">IGST</td>`
        : `<td class="c">CGST<br>SGST</td>`;

      return `<tr>
        <td class="c">${i + 1}.</td>
        <td class="l">${item.productTitle}${item.variantName ? `<br><span class="vtxt">Variant: ${item.variantName}${item.variantColor ? " | " + item.variantColor : ""}${item.sku ? " | SKU: " + item.sku : ""}</span>` : ""}</td>
        <td class="r">&#8377;${fmt(item.sellingPrice)}</td>
        <td class="c">${item.quantity}</td>
        <td class="r">&#8377;${fmt(item.taxableAmount)}</td>
        ${taxRateCell}
        ${taxTypeCell}
        <td class="r">&#8377;${fmt(item.totalTax)}</td>
        <td class="r">&#8377;${fmt(item.lineTotal)}</td>
      </tr>`;
    })
    .join("\n");

  const shippingRow = `<tr>
    <td class="c">${invoice.items.length + 1}.</td>
    <td class="l">Shipping</td>
    <td class="r">&#8377;${fmt(invoice.summary.shippingCharge)}</td>
    <td class="c">1</td>
    <td class="r">&#8377;${fmt(invoice.summary.shippingCharge)}</td>
    <td class="c">0%</td>
    <td class="c">N/A</td>
    <td class="r">&#8377;0</td>
    <td class="r">&#8377;${fmt(invoice.summary.shippingCharge)}</td>
  </tr>`;

  let discountRow = "";
  if (invoice.summary.discount && invoice.summary.discount > 0) {
    discountRow = `<tr>
    <td class="c">${invoice.items.length + 2}.</td>
    <td class="l">Reward Discount</td>
    <td class="r">&#8377;${fmt(invoice.summary.discount)}</td>
    <td class="c">1</td>
    <td class="r">&#8377;${fmt(invoice.summary.discount)}</td>
    <td class="c">0%</td>
    <td class="c">N/A</td>
    <td class="r">&#8377;0</td>
    <td class="r">-&#8377;${fmt(invoice.summary.discount)}</td>
  </tr>`;
  }

  const platformFeeRow = `<tr>
    <td class="c">${invoice.items.length + 3}.</td>
    <td class="l">Platform Fee</td>
    <td class="r">&#8377;${fmt(invoice.summary.platformFee)}</td>
    <td class="c">1</td>
    <td class="r">&#8377;${fmt(invoice.summary.platformFee)}</td>
    <td class="c">0%</td>
    <td class="c">N/A</td>
    <td class="r">&#8377;0</td>
    <td class="r">&#8377;${fmt(invoice.summary.platformFee)}</td>
  </tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12.5px;
    color: #000;
    padding: 10px;
  }

  .container {
    max-width: 778px;
    margin: 0 auto;
    padding: 18px 20px 28px;
    background: #fff;
  }

  /* ── HEADER ── */
  .hdr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
  }

  .hdr-left {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .logo-box {
    width: 44px;
    height: 44px;
    background: #fff0f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .logo-box span {
    font-family: "Happy Monkey", Arial, Helvetica, sans-serif;
    font-size: 7px;
    font-weight: bold;
    color: #1800AC;
    line-height: 1.4;
    text-align: center;
  } 

  .brand {
    font-family: "Happy Monkey", Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: bold;
    color: #1800AC;
  }

  .inv-title {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 23px;
    font-weight: bold;
    color: #111;
    letter-spacing: 0.5px;
  }

  /* ── INFO GRID (Sold by / Invoice Details) ── */
  .info-grid {
    display: flex;
    border: 1px solid #ccc;
    margin-top: 0;
  }

  .icol {
    width: 50%;
  }

  .icol + .icol {
    border-left: 1px solid #ccc;
  }

  .icol-head {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 12.5px;
    text-align: center;
    padding: 7px 8px 6px;
    border-bottom: 1px solid #ccc;
  }

  .icol-body {
    padding: 9px 14px 10px;
    line-height: 1.85;
    font-size: 12px;
  }

  /* ── SHIPPING ── */
  .ship-box {
    border: 1px solid #ccc;
    border-top: none;
  }

  .ship-head {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 12.5px;
    text-align: center;
    padding: 7px 8px 6px;
    border-bottom: 1px solid #ccc;
  }

  .ship-body {
    padding: 9px 14px 10px;
    line-height: 1.85;
    font-size: 12px;
  }

  /* ── ITEMS TABLE ── */
  .itbl {
    width: 100%;
    border-collapse: collapse;
    margin-top: 14px;
    font-size: 12px;
  }

  .itbl th {
    border: 1px solid #ccc;
    background: #f3f3f3;
    padding: 6px 4px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11.5px;
    font-weight: bold;
    text-align: center;
    line-height: 1.35;
    vertical-align: middle;
  }

  .itbl td {
    border: 1px solid #ccc;
    padding: 6px 5px;
    vertical-align: middle;
    line-height: 1.45;
  }

  .itbl .tfoot td {
    font-weight: bold;
  }

  .c  { text-align: center; }
  .r  { text-align: right; }
  .l  { text-align: left; }
  .vtxt { font-size: 10.5px; color: #555; }

  /* ── AMOUNT IN WORDS ── */
  .words {
    margin-top: 13px;
    font-size: 12.5px;
    line-height: 1.8;
  }

  /* ── SIGNATURE ── */
  .sig {
    margin-top: 36px;
    text-align: right;
    font-size: 13px;
  }

  .sig-name {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14.5px;
    font-weight: bold;
  }

  .sig-rule {
    display: inline-block;
    border-top: 1.5px solid #000;
    min-width: 200px;
    padding-top: 5px;
    margin-top: 10px;
    font-size: 12.5px;
  }
</style>
</head>
<body>
<div class="container">

  <!-- HEADER -->
  <div class="hdr">
    <div class="hdr-left">
      <div class="logo-box">
        ${
          invoice.seller.logo
            ? `<img src="${invoice.seller.logo}" alt="Logo" style="width:100%; height:100%; object-fit:contain;">`
            : `<span>${invoice.seller.fullName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 3)
                .toUpperCase()}</span>`
        }
      </div>
      <span class="brand">${invoice.seller.fullName}</span>
    </div>
    <div class="inv-title">TAX INVOICE</div>
  </div>

  <!-- SOLD BY / INVOICE DETAILS -->
  <div class="info-grid">
    <div class="icol">
      <div class="icol-head">Sold by</div>
      <div class="icol-body">
        <div>Name: <strong>${invoice.seller.fullName}</strong></div>
        <div>Address: <strong>${invoice.seller.addressLine1},${invoice.seller.city}, ${invoice.seller.state},${invoice.seller.pinCode}, ${invoice.seller.country}</strong></div>
        <div>Phone No.: <strong>+91 ${invoice.seller.phone}</strong></div>
        <div>Email: <strong>${invoice.seller.email}</strong></div>
        <div>GSTIN: <strong>${invoice.seller.gstin || "-"}</strong></div>
      </div>
    </div>
    <div class="icol">
      <div class="icol-head">Invoice Details</div>
      <div class="icol-body">
        <div>Invoice No.: <strong>${invoice.invoiceNumber}</strong></div>
        <div>Invoice Date: <strong>${formatDate(invoice.issuedAt)}</strong></div>
        <div>Order ID: <strong>${invoice.orderNumber}</strong></div>
        <div>Order Date: <strong>${formatDate(invoice.issuedAt)}</strong></div>
        <div>Payment Status: <strong>${capitalize(invoice.paymentStatus)}</strong></div>
      </div>
    </div>
  </div>

  <!-- SHIPPING ADDRESS -->
  <div class="ship-box">
    <div class="ship-head">Shipping Address</div>
    <div class="ship-body">
      <div>Name: <strong>${invoice.buyer.fullName}</strong></div>
      <div>Address: <strong>${invoice.buyer.addressLine1}, ${invoice.buyer.city}, ${invoice.buyer.state}-${invoice.buyer.pinCode}</strong></div>
      <div>Phone No.: <strong>+91 ${invoice.buyer.phone}</strong></div>
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <table class="itbl">
    <thead>
      <tr>
        <th style="width:38px">S.<br>No.</th>
        <th>Product<br>Description</th>
        <th style="width:66px">Unit<br>Price</th>
        <th style="width:33px">QTY</th>
        <th style="width:76px">Net<br>Amount</th>
        <th style="width:48px">Tax<br>Rate</th>
        <th style="width:50px">Tax<br>Type</th>
        <th style="width:72px">Tax<br>Amount</th>
        <th style="width:66px">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
      ${shippingRow}
      ${platformFeeRow}
      ${discountRow}
      <tr class="tfoot">
        <td colspan="7"><strong>Total</strong></td>
        <td class="r"><strong>&#8377;${fmt(invoice.summary.totalTax)}</strong></td>
        <td class="r"><strong>&#8377;${fmt(invoice.summary.grandTotal)}</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- AMOUNT IN WORDS -->
  <div class="words">
    <div><strong>Amount in words:</strong></div>
    <div>${invoice.summary.amountInWords}</div>
  </div>

  <!-- SIGNATURE -->
  <div class="sig">
    <div class="sig-name">${invoice.seller.fullName}</div>
    <div><span class="sig-rule">Authorized Signatory</span></div>
  </div>

</div>
</body>
</html>`;
}

// Works on: localhost, Render, EC2, Lambda — everywhere
const getExecutablePath = async () => {
  // Production (Render, EC2, any Linux server)
  if (env.NODE_ENV === "production") {
    return await chromium.executablePath();
  }

  // Local Mac
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }

  // Local Windows
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }

  // Local Linux
  return "/usr/bin/google-chrome";
};

// let browser;

// export const getBrowser = async () => {
//   if (!browser) {
//     browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//   }
//   return browser;
// };

export const generateInvoicePDF = async (invoice) => {
  const executablePath = await getExecutablePath();

  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  try {
    const html = generateInvoiceHTML(invoice);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    if (!buffer || buffer.length < 1000) {
      throw new Error(`Invalid PDF buffer: ${buffer?.length} bytes`);
    }

    return buffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  } finally {
    await page.close();
    await browser.close();
  }
};
