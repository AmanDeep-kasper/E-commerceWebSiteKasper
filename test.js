import crypto from "crypto";

const orderId = "order_Se8Hdgu5rpvrvV";
const paymentId = "pay_test_123";
const secret = "NQ6m1JU3SEaBt7EXCqv1TsUZ";

const body = orderId + "|" + paymentId;

const signature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

console.log(signature);