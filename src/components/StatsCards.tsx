import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, AlertTriangle, FileText } from 'lucide-react';
import { ProcessingStats } from '@/types/order';

interface StatsCardsProps {
  stats: ProcessingStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total de Linhas",
      value: stats.totalRows.toLocaleString('pt-BR'),
      icon: FileText,
      bgColor: "bg-gradient-card",
    },
    {
      title: "Clientes Únicos",
      value: stats.totalClients.toLocaleString('pt-BR'),
      icon: Users,
      bgColor: "bg-gradient-card",
    },
    {
      title: "Pedidos Únicos",
      value: stats.totalUniqueOrders.toLocaleString('pt-BR'),
      icon: ShoppingCart,
      bgColor: "bg-gradient-card",
    },
    {
      title: "Alertas de Múltiplos Pedidos",
      value: stats.clientsWithMultipleOrders.toLocaleString('pt-BR'),
      icon: AlertTriangle,
      bgColor: stats.clientsWithMultipleOrders > 0 ? "bg-gradient-to-br from-warning/10 to-warning/5" : "bg-gradient-card",
      highlight: stats.clientsWithMultipleOrders > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className={`${card.bgColor} shadow-md border-border/50 transition-all duration-200 hover:shadow-lg ${
            card.highlight ? 'ring-2 ring-warning/20' : ''
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.highlight ? 'text-warning' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.highlight ? 'text-warning-foreground' : 'text-foreground'}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};