// This is a placeholder for the Vipps callback.
// In a real application, you would verify the signature of the request
// to ensure it's coming from Vipps, and then update the booking status
// in your database.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Vipps callback received:", body);

    // 1. Verify the signature of the request.
    // This is a critical security step to ensure the request is from Vipps.
    // You will need to get the signature from the request headers and
    // use your client secret to verify it.
    // const signature = req.headers.get('X-Vipps-Signature');
    // const isSignatureValid = await verifyVippsSignature(body, signature);
    // if (!isSignatureValid) {
    //   return new Response("Invalid signature", { status: 401 });
    // }

    // 2. Update the booking status in your database.
    // You can get the orderId from the request body.
    const { orderId, transactionInfo } = body;
    if (transactionInfo.status === "RESERVED") {
      // The payment has been reserved. You can now capture it.
      // In a real application, you would update the booking status to "paid"
      // and then capture the payment.
      console.log(`Payment for order ${orderId} has been reserved.`);
    } else {
      // The payment has failed or been cancelled.
      console.log(`Payment for order ${orderId} has failed or been cancelled.`);
    }

    // 3. Return a success response to Vipps.
    return new Response("Callback received", { status: 200 });

  } catch (error) {
    console.error("Failed to process Vipps callback:", error);
    return new Response("Failed to process Vipps callback", { status: 500 });
  }
}

// async function verifyVippsSignature(body: any, signature: string | null): Promise<boolean> {
//   if (!signature) {
//     return false;
//   }

//   const clientSecret = process.env.VIPPS_CLIENT_SECRET;
//   if (!clientSecret) {
//     return false;
//   }

//   // This is a simplified example. You should use a proper crypto library
//   // to verify the signature.
//   const crypto = require('crypto');
//   const hmac = crypto.createHmac('sha256', clientSecret);
//   hmac.update(JSON.stringify(body));
//   const expectedSignature = hmac.digest('hex');

//   return signature === expectedSignature;
// }
