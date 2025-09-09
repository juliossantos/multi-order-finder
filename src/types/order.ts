export interface OrderData {
  codigoCliente: string;
  nomeFantasia: string;
  numeroPedido: string;
  dataEmissao: string;
  codigoProduto: string;
  descricaoProduto: string;
  quantidade: number;
  peso: number;
  endereco: string;
  bairro: string;
  cidade: string;
  observacao: string;
}

export interface ClientAlert {
  codigoCliente: string;
  nomeFantasia: string;
  pedidos: string[];
  totalPedidos: number;
  pedidosDetalhados: PedidoDetalhado[];
}

export interface PedidoDetalhado {
  numeroPedido: string;
  dataEmissao: string;
  itens: OrderData[];
}

export interface ProcessingStats {
  totalRows: number;
  totalClients: number;
  clientsWithMultipleOrders: number;
  totalUniqueOrders: number;
}