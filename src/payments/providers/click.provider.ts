import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from './payment.provider';

/**
 * Click payment provider stub
 * Replace stub methods with real Click API calls in production
 */
@Injectable()
export class ClickProvider implements PaymentProvider {
  private readonly logger = new Logger(ClickProvider.name);

  constructor(private readonly config: ConfigService) {}

  createPayment(
    amount: number,
    txId: string,
  ): Promise<{ checkoutUrl: string }> {
    this.logger.log(`[Click] Create payment: amount=${amount}, txId=${txId}`);
    // TODO: Replace with real Click API integration
    return Promise.resolve({
      checkoutUrl: `https://my.click.uz/pay/?service_id=xxx&merchant_id=yyy&amount=${amount}&transaction_param=${txId}`,
    });
  }

  verifyWebhook(_payload: unknown, _signature: string): boolean {
    // TODO: Verify CLICK-SIGN header using CLICK_SECRET
    const secret = this.config.get<string>('CLICK_SECRET', '');
    this.logger.log(
      `[Click] Verifying webhook (secret configured: ${!!secret})`,
    );
    return true; // stub
  }

  getName() {
    return 'CLICK';
  }
}
