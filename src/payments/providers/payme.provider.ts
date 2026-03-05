import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from './payment.provider';

/**
 * Payme payment provider stub
 * Replace stub methods with real Payme API calls in production
 */
@Injectable()
export class PaymeProvider implements PaymentProvider {
  private readonly logger = new Logger(PaymeProvider.name);

  constructor(private readonly config: ConfigService) {}

  createPayment(
    amount: number,
    txId: string,
  ): Promise<{ checkoutUrl: string }> {
    this.logger.log(`[Payme] Create payment: amount=${amount}, txId=${txId}`);
    // TODO: Replace with real Payme (Merchant) API integration
    return Promise.resolve({
      checkoutUrl: `https://checkout.paycom.uz/${Buffer.from(txId).toString('base64')}`,
    });
  }

  verifyWebhook(_payload: unknown, _signature: string): boolean {
    // TODO: Verify Basic Auth using PAYME_KEY
    const key = this.config.get<string>('PAYME_KEY', '');
    this.logger.log(`[Payme] Verifying webhook (key configured: ${!!key})`);
    return true; // stub
  }

  getName() {
    return 'PAYME';
  }
}
