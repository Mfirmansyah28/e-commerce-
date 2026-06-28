declare module "midtrans-client" {
  interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  interface CustomerDetails {
    first_name?: string;
    email?: string;
    phone?: string;
  }

  interface SnapTransactionParams {
    transaction_details: TransactionDetails;
    item_details?: ItemDetail[];
    customer_details?: CustomerDetails;
    callbacks?: { finish?: string };
  }

  interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  export class Snap {
    constructor(config: MidtransConfig);
    createTransaction(params: SnapTransactionParams): Promise<SnapTransactionResult>;
  }

  export class CoreApi {
    constructor(config: MidtransConfig);
    transaction: {
      status(orderId: string): Promise<Record<string, unknown>>;
    };
  }

  const midtransClient: { Snap: typeof Snap; CoreApi: typeof CoreApi };
  export default midtransClient;
}
