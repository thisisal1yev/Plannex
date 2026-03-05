/**
 * Common interface for all payment providers (Click, Payme, etc.)
 */
export interface PaymentProvider {
  /** Initiates a payment and returns a checkout URL */
  createPayment(amount: number, txId: string): Promise<{ checkoutUrl: string }>;

  /** Verifies the webhook signature/token */
  verifyWebhook(payload: unknown, signature: string): boolean;

  /** Returns the provider name */
  getName(): string;
}
