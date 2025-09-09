import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar, Weight, Hash } from 'lucide-react';
import { ClientAlert } from '@/types/order';

interface ClientDetailsModalProps {
  client: ClientAlert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDetailsModal = ({ client, isOpen, onClose }: ClientDetailsModalProps) => {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            Detalhes dos Pedidos - {client.nomeFantasia}
          </DialogTitle>
          <p className="text-muted-foreground">
            Código: {client.codigoCliente} | Total de Pedidos: {client.totalPedidos}
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {client.pedidosDetalhados.map((pedido) => (
              <Card key={pedido.numeroPedido} className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <span>Pedido nº {pedido.numeroPedido}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Emissão: {pedido.dataEmissao}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pedido.itens.map((item, index) => (
                      <div key={index} className="border border-border/30 rounded-lg p-4 bg-secondary/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm text-muted-foreground">Código:</span>
                              <Badge variant="outline" className="text-xs">
                                {item.codigoProduto}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">
                                {item.descricaoProduto}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-4 items-center justify-start md:justify-end">
                            <div className="flex items-center gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Qtde:</span>
                              <Badge variant="secondary" className="font-semibold">
                                {item.quantidade}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Weight className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Peso:</span>
                              <Badge variant="secondary" className="font-semibold">
                                {item.peso}kg
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {item.observacao && (
                          <div className="mt-3 pt-3 border-t border-border/30">
                            <span className="text-xs text-muted-foreground">Observação: </span>
                            <span className="text-xs text-foreground">{item.observacao}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};