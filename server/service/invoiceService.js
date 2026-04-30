import Invoice from "../models/Invoice.js";
import Order from "../models/Order.js";
import Warehouse from "../models/admin/WarehouseConfig.js";
import BusinessSetting from "../models/admin/BusinessConfig.js";

/* =========================
   GST STATE CODES
========================= */
const GST_STATE_CODES = {
  "Jammu and Kashmir": "01",
  "Himachal Pradesh": "02",
  Punjab: "03",
  Chandigarh: "04",
  Uttarakhand: "05",
  Haryana: "06",
  Delhi: "07",
  Rajasthan: "08",
  "Uttar Pradesh": "09",
  Bihar: "10",
  Sikkim: "11",
  "Arunachal Pradesh": "12",
  Nagaland: "13",
  Manipur: "14",
  Mizoram: "15",
  Tripura: "16",
  Meghalaya: "17",
  Assam: "18",
  "West Bengal": "19",
  Jharkhand: "20",
  Odisha: "21",
  Chhattisgarh: "22",
  "Madhya Pradesh": "23",
  Gujarat: "24",
  "Daman and Diu": "25",
  "Dadra and Nagar Haveli and Daman and Diu": "26",
  Maharashtra: "27",
  Karnataka: "29",
  Goa: "30",
  Lakshadweep: "31",
  Kerala: "32",
  "Tamil Nadu": "33",
  Puducherry: "34",
  "Andaman and Nicobar Islands": "35",
  Telangana: "36",
  "Andhra Pradesh": "37",
  Ladakh: "38",
};

const round = (num) => Math.round(num * 100) / 100;

const stateCode = (state) => GST_STATE_CODES[state] || "";

/* =========================
   AMOUNT IN WORDS
========================= */
function amountInWords(num) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const format = (n) => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + format(n % 100) : "")
      );
    if (n < 100000)
      return (
        format(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + format(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        format(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + format(n % 100000) : "")
      );

    return (
      format(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + format(n % 10000000) : "")
    );
  };

  return `${format(Math.round(num))} Rupees Only`;
}

/* =========================
   GST CALCULATION (INCLUSIVE)
========================= */
function calculateTax(price, qty, gst, sellerState, buyerState) {
  const totalPrice = price * qty;

  const taxableAmount = totalPrice / (1 + gst / 100);
  const totalTax = totalPrice - taxableAmount;

  const intra = sellerState === buyerState;

  if (intra) {
    return {
      taxType: "CGST_SGST",
      taxableAmount: round(taxableAmount),

      cgstRate: gst / 2,
      sgstRate: gst / 2,
      igstRate: 0,

      cgstAmount: round(totalTax / 2),
      sgstAmount: round(totalTax / 2),
      igstAmount: 0,

      totalTax: round(totalTax),
      lineTotal: round(totalPrice),
    };
  }

  return {
    taxType: "IGST",
    taxableAmount: round(taxableAmount),

    cgstRate: 0,
    sgstRate: 0,
    igstRate: gst,

    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: round(totalTax),

    totalTax: round(totalTax),
    lineTotal: round(totalPrice),
  };
}

/* =========================
   MAIN FUNCTION
========================= */
export async function createInvoiceFromOrder(orderId) {
  // prevent duplicate invoice
  const exists = await Invoice.findOne({ orderId });
  if (exists) return exists;

  const order = await Order.findById(orderId).lean();
  if (!order) throw new Error("Order not found");

  if (order.paymentStatus !== "paid") {
    throw new Error("Invoice only allowed for paid orders");
  }

  const business = await BusinessSetting.findOne({ isActive: true }).lean();
  const warehouse = await Warehouse.findOne({ isActive: true }).lean();

  if (!business) throw new Error("Business settings missing");
  if (!warehouse) throw new Error("Warehouse missing");

  const sellerState = stateCode(business.address.state);
  const buyerState = stateCode(order.shippingAddress.state);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  /* =========================
     ITEMS BUILD
  ========================= */
  const items = order.items.map((item) => {
    const tax = calculateTax(
      item.sellingPrice,
      item.quantity,
      item.gst,
      sellerState,
      buyerState,
    );

    cgst += tax.cgstAmount;
    sgst += tax.sgstAmount;
    igst += tax.igstAmount;

    return {
      orderItemId: item._id,
      productId: item.product,
      variantId: item.variantId,
      categoryId: item.category,

      sku: item.variantSkuId,
      productTitle: item.productTitle,
      variantName: item.variantName,
      variantColor: item.variantColor,
      image: item.image,

      quantity: item.quantity,
      mrp: item.mrp,
      sellingPrice: item.sellingPrice,

      ...tax,
    };
  });

  /* =========================
     TOTALS
  ========================= */
  const shippingCharge = order.shippingCharge || 0;
  const platformFee = order.platformFee || 0;

  const subtotal = order.subtotal; // already GST inclusive
  const totalTax = round(cgst + sgst + igst);
  const discount = order.discount;

  const grandTotal = round(subtotal + shippingCharge + platformFee - discount);

  /* =========================
     CREATE INVOICE
  ========================= */
  const invoice = await Invoice.create({
    orderId: order._id,
    orderNumber: order.orderNumber,
    customerId: order.user,

    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,

    seller: {
      fullName: business.businessName,
      phone: business.phone,
      email: business.email,
      addressLine1: business.address.addressLine1,
      city: business.address.city,
      state: business.address.state,
      stateCode: sellerState,
      pinCode: business.address.pinCode,
      gstin: business.gstNumber,
      logo: business.logo.url || null,
    },

    buyer: {
      fullName: order.shippingAddress.fullName,
      phone: order.shippingAddress.phone,
      email: order.shippingAddress.email,
      addressLine1: order.shippingAddress.address,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      stateCode: buyerState,
      pinCode: order.shippingAddress.pinCode,
    },

    shippingFrom: {
      fullName: warehouse.name,
      phone: warehouse.phone,
      email: warehouse.email,
      addressLine1: warehouse.address.addressLine1,
      city: warehouse.address.city,
      state: warehouse.address.state,
      stateCode: stateCode(warehouse.address.state),
      pinCode: warehouse.address.pinCode,
    },

    items,

    summary: {
      mrpTotal: order.mrpTotal,
      subtotal,
      discount,

      shippingCharge,
      platformFee,

      cgst: round(cgst),
      sgst: round(sgst),
      igst: round(igst),

      totalTax,
      grandTotal,

      amountInWords: amountInWords(grandTotal),
    },

    taxType: sellerState === buyerState ? "CGST_SGST" : "IGST",
  });

  return invoice;
}
