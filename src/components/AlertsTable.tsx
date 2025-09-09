import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Download, AlertTriangle } from 'lucide-react';
import { ClientAlert } from '@/types/order';

interface AlertsTableProps {
  alerts: ClientAlert[];
}

export const AlertsTable = ({ alerts }: AlertsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = useMemo(() => {
    if (!searchTerm) return alerts;
    
    const term = searchTerm.toLowerCase();
    return alerts.filter(alert => 
      alert.codigoCliente.toLowerCase().includes(term) ||
      alert.nomeFantasia.toLowerCase().includes(term) ||
      alert.pedidos.some(pedido => pedido.toLowerCase().includes(term))
    );
  }, [alerts, searchTerm]);

  const exportData = () => {
    const csvContent = [
      ['Código Cliente', 'Nome Fantasia', 'Pedidos', 'Total Pedidos'],
      ...filteredAlerts.map(alert => [
        alert.codigoCliente,
        alert.nomeFantasia,
        alert.pedidos.join('; '),
        alert.totalPedidos.toString()
      ])
    ];

    const csvString = csvContent.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clientes_multiplos_pedidos.csv';
    link.click();
  };

  if (alerts.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-md border-border/50">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum alerta encontrado
          </h3>
          <p className="text-muted-foreground">
            Não foram identificados clientes com múltiplos pedidos distintos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-elegant border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Clientes com Múltiplos Pedidos
          </CardTitle>
          <Button 
            onClick={exportData}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código do cliente, nome ou pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Código Cliente</TableHead>
                <TableHead className="font-semibold">Nome Fantasia</TableHead>
                <TableHead className="font-semibold">Pedidos</TableHead>
                <TableHead className="font-semibold text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert, index) => (
                <TableRow key={index} className="hover:bg-muted/20">
                  <TableCell className="font-mono font-medium">
                    {alert.codigoCliente}
                  </TableCell>
                  <TableCell className="font-medium">
                    {alert.nomeFantasia}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {alert.pedidos.map((pedido, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {pedido}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/20">
                      {alert.totalPedidos}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredAlerts.length !== alerts.length && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Mostrando {filteredAlerts.length} de {alerts.length} alertas
          </div>
        )}
      </CardContent>
    </Card>
  );
};