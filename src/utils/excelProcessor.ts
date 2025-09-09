import * as XLSX from 'xlsx';
import { OrderData, ClientAlert, ProcessingStats } from '@/types/order';

export const processExcelFiles = async (files: File[]): Promise<{
  alerts: ClientAlert[];
  stats: ProcessingStats;
}> => {
  const allData: OrderData[] = [];

  // Processar cada arquivo
  for (const file of files) {
    const data = await readExcelFile(file);
    allData.push(...data);
  }

  // Agrupar por cliente e pedido
  const clientOrders = new Map<string, Map<string, OrderData[]>>();
  
  allData.forEach(row => {
    const clientId = row.codigoCliente;
    const orderId = row.numeroPedido;

    if (!clientOrders.has(clientId)) {
      clientOrders.set(clientId, new Map());
    }

    const clientOrderMap = clientOrders.get(clientId)!;
    if (!clientOrderMap.has(orderId)) {
      clientOrderMap.set(orderId, []);
    }

    clientOrderMap.get(orderId)!.push(row);
  });

  // Identificar clientes com múltiplos pedidos
  const alerts: ClientAlert[] = [];
  let totalUniqueOrders = 0;

  clientOrders.forEach((orders, clientId) => {
    const orderIds = Array.from(orders.keys());
    totalUniqueOrders += orderIds.length;

    if (orderIds.length > 1) {
      const firstOrder = orders.get(orderIds[0])![0];
      
      // Criar pedidos detalhados
      const pedidosDetalhados = orderIds.map(orderId => ({
        numeroPedido: orderId,
        dataEmissao: orders.get(orderId)![0].dataEmissao,
        itens: orders.get(orderId)!
      }));

      alerts.push({
        codigoCliente: clientId,
        nomeFantasia: firstOrder.nomeFantasia,
        pedidos: orderIds.sort(),
        totalPedidos: orderIds.length,
        pedidosDetalhados: pedidosDetalhados.sort((a, b) => a.numeroPedido.localeCompare(b.numeroPedido)),
      });
    }
  });

  // Ordenar alertas por número de pedidos (decrescente)
  alerts.sort((a, b) => b.totalPedidos - a.totalPedidos);

  const stats: ProcessingStats = {
    totalRows: allData.length,
    totalClients: clientOrders.size,
    clientsWithMultipleOrders: alerts.length,
    totalUniqueOrders,
  };

  return { alerts, stats };
};

const readExcelFile = (file: File): Promise<OrderData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Assumir que a primeira linha contém os cabeçalhos
        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        const processedData: OrderData[] = rows
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
          .map(row => {
            const obj: any = {};
            
            // Mapear cabeçalhos para campos esperados
            headers.forEach((header, index) => {
              const normalizedHeader = normalizeHeader(header);
              obj[normalizedHeader] = row[index] || '';
            });

            // Se não conseguiu mapear pelos cabeçalhos, usar posições fixas das colunas
            // Coluna 1 (índice 0) = código do cliente, Coluna 3 (índice 2) = número do pedido
            const codigoCliente = String(obj.codigoCliente || obj.codigo || row[0] || '').trim();
            const numeroPedido = String(obj.numeroPedido || obj.pedido || row[2] || '').trim();

            return {
              codigoCliente,
              nomeFantasia: String(obj.nomeFantasia || obj.nome || row[1] || '').trim(),
              numeroPedido,
              dataEmissao: String(obj.dataEmissao || obj.data || row[3] || '').trim(),
              codigoProduto: String(obj.codigoProduto || obj.produto || row[4] || '').trim(),
              descricaoProduto: String(obj.descricaoProduto || obj.descricao || row[5] || '').trim(),
              quantidade: Number(obj.quantidade || row[6] || 0),
              peso: Number(obj.peso || row[7] || 0),
              endereco: String(obj.endereco || row[8] || '').trim(),
              bairro: String(obj.bairro || row[9] || '').trim(),
              cidade: String(obj.cidade || row[10] || '').trim(),
              observacao: String(obj.observacao || obj.obs || row[11] || '').trim(),
            } as OrderData;
          })
          .filter(item => item.codigoCliente && item.numeroPedido);

        resolve(processedData);
      } catch (error) {
        reject(new Error(`Erro ao processar arquivo ${file.name}: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error(`Erro ao ler arquivo ${file.name}`));
    };

    reader.readAsArrayBuffer(file);
  });
};

const normalizeHeader = (header: string): string => {
  const normalizedHeader = String(header)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();

  // Mapear diferentes variações de nomes de colunas
  const headerMap: { [key: string]: string } = {
    'codigo do cliente': 'codigoCliente',
    'codigo cliente': 'codigoCliente',
    'cliente': 'codigoCliente',
    'cod cliente': 'codigoCliente',
    'nome fantasia': 'nomeFantasia',
    'razao social': 'nomeFantasia',
    'nome': 'nomeFantasia',
    'numero do pedido': 'numeroPedido',
    'numero pedido': 'numeroPedido',
    'pedido': 'numeroPedido',
    'num pedido': 'numeroPedido',
    'data de emissao': 'dataEmissao',
    'data emissao': 'dataEmissao',
    'data': 'dataEmissao',
    'codigo do produto': 'codigoProduto',
    'codigo produto': 'codigoProduto',
    'cod produto': 'codigoProduto',
    'produto': 'codigoProduto',
    'descricao do produto': 'descricaoProduto',
    'descricao produto': 'descricaoProduto',
    'descricao': 'descricaoProduto',
    'desc produto': 'descricaoProduto',
    'quantidade': 'quantidade',
    'qtd': 'quantidade',
    'qty': 'quantidade',
    'peso': 'peso',
    'endereco': 'endereco',
    'bairro': 'bairro',
    'cidade': 'cidade',
    'observacao': 'observacao',
    'obs': 'observacao',
    'observacoes': 'observacao',
  };

  return headerMap[normalizedHeader] || normalizedHeader;
};