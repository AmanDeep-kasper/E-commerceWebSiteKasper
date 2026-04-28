import Invoice from "../models/Invoice.js";
import Order from "../models/Order.js";
import Warehouse from "../models/admin/WarehouseConfig.js";
import BusinessSetting from "../models/admin/BusinessConfig";

const GST_STATE_CODES = {
  Bihar: "10",
  Delhi: "07",
  Karnataka: "29",
  Maharashtra: "27",
  UttarPradesh: "09",
};

function stateCode(state) {
  return GST_STATE_CODES[state] || "";
}

function amountInWords(amount) {
  return `${amount} Rupees Only`;
}

function calculateTax(price, qty, gst, sellerState, buyerState) {
  const taxableAmount = price * qty;
  const totalTax = (taxableAmount * gst) / 100;

  const intra = sellerState === buyerState;

  if (intra) {
    return {
      taxType: "CGST_SGST",
      taxableAmount,
      cgstRate: gst / 2,
      sgstRate: gst / 2,
      igstRate: 0,
      cgstAmount: totalTax / 2,
      sgstAmount: totalTax / 2,
      igstAmount: 0,
      totalTax,
      lineTotal: taxableAmount + totalTax,
    };
  }

  return {
    taxType: "IGST",
    taxableAmount,
    cgstRate: 0,
    sgstRate: 0,
    igstRate: gst,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: totalTax,
    totalTax,
    lineTotal: taxableAmount + totalTax,
  };
}

export async function createInvoiceFromOrder(orderId) {
  const exists = await Invoice.findOne({ orderId });

  if (exists) return exists;

  const order = await Order.findById(orderId).lean();
  if (!order) throw new Error("Order not found");

  const business = await BusinessSetting.findOne({ isActive: true }).lean();
  const warehouse = await Warehouse.findOne({ isActive: true }).lean();

  if (!business) throw new Error("Business settings missing");
  if (!warehouse) throw new Error("Warehouse missing");

  const sellerState = stateCode(business.address.state);
  const buyerState = stateCode(order.shippingAddress.state);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

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
      hsnCode: "000000", // later product/category se fetch karna
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
      subtotal: order.subtotal,
      discount: order.discount,
      shippingCharge: order.shippingCharge,
      cgst,
      sgst,
      igst,
      totalTax: order.totalGST,
      grandTotal: order.grandTotal,
      amountInWords: amountInWords(order.grandTotal),
    },

    taxType: sellerState === buyerState ? "CGST_SGST" : "IGST",
  });

  return invoice;
}
