import { POST } from './route';
import { NextRequest } from 'next/server';

describe('Vipps API Route', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should initiate a Vipps payment and return a redirect URL', async () => {
    // Mock the Vipps API responses
    fetchMock.mockResponses(
      JSON.stringify({ access_token: 'test-access-token' }),
      JSON.stringify({ url: 'https://api.vipps.no/d/t=...' })
    );

    // Set the environment variables
    process.env.VIPPS_CLIENT_SECRET = 'test-client-secret';
    process.env.VIPPS_SUBSCRIPTION_KEY = 'test-subscription-key';
    process.env.VIPPS_MERCHANT_SERIAL_NUMBER = 'test-merchant-serial-number';

    // Create a mock request
    const request = new NextRequest('https://rentcars.example.com/api/vipps', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'test-order-id', amount: 100 }),
    });

    // Call the API route
    const response = await POST(request);

    // Verify the response
    expect(response.status).toBe(200);
    const { redirectUrl } = await response.json();
    expect(redirectUrl).toBe('https://api.vipps.no/d/t=...');

    // Verify that fetch was called correctly
    expect(fetchMock.mock.calls.length).toBe(2);

    // Verify the access token request
    const accessTokenRequest = fetchMock.mock.calls[0];
    expect(accessTokenRequest[0]).toBe('https://api.vipps.no/accesstoken/get');
    expect(accessTokenRequest[1]?.method).toBe('POST');
    expect(accessTokenRequest[1]?.headers).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
      'client_id': '23b26a2c-66a9-436c-a5c3-aead3187418e',
      'client_secret': 'test-client-secret',
      'Ocp-Apim-Subscription-Key': 'test-subscription-key',
    });

    // Verify the payment initiation request
    const paymentInitiationRequest = fetchMock.mock.calls[1];
    expect(paymentInitiationRequest[0]).toBe('https://api.vipps.no/epayment/v1/payments');
    expect(paymentInitiationRequest[1]?.method).toBe('POST');
    expect(paymentInitiationRequest[1]?.headers).toEqual({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'test-subscription-key',
      'Authorization': 'Bearer test-access-token',
      'Idempotency-Key': 'test-order-id',
    });
    expect(paymentInitiationRequest[1]?.body).toBe(JSON.stringify({
      merchantInfo: {
        merchantSerialNumber: 'test-merchant-serial-number',
        callbackUrl: 'https://rentcars.example.com/api/vipps/callback',
        returnUrl: 'https://rentcars.example.com/confirmation',
      },
      customerInfo: {},
      transaction: {
        orderId: 'test-order-id',
        amount: 10000,
        transactionText: 'Car rental from RentCars',
      },
    }));
  });
});
