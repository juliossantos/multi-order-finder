import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { StatsCards } from '@/components/StatsCards';
import { AlertsTable } from '@/components/AlertsTable';
import { processExcelFiles } from '@/utils/excelProcessor';
import { ClientAlert, ProcessingStats } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [alerts, setAlerts] = useState<ClientAlert[]>([]);
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = async (files: File[]) => {
    setIsProcessing(true);
    
    try {
      const result = await processExcelFiles(files);
      setAlerts(result.alerts);
      setStats(result.stats);
      
      toast({
        title: "Análise concluída com sucesso!",
        description: `Processados ${result.stats.totalRows} registros. ${result.alerts.length} cliente(s) com múltiplos pedidos identificado(s).`,
      });
    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Erro desconhecido ao processar arquivos.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-red-700 text-primary-foreground shadow-elegant">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Sistema de Análise de Pedidos</h1>
              <p className="text-primary-foreground/80 mt-1">
                Identificação de clientes com pedidos múltiplos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Upload Section */}
        <FileUpload onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />

        {/* Results Section */}
        {stats && (
          <>
            {/* Stats Cards */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Estatísticas do Processamento
              </h2>
              <StatsCards stats={stats} />
            </div>

            {/* Alerts Table */}
            <div>
              <AlertsTable alerts={alerts} />
            </div>
          </>
        )}

        {/* Instructions Card */}
        {!stats && (
          <Card className="bg-gradient-card shadow-md border-border/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Como utilizar o sistema:
              </h3>
              <ol className="space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                  <span>Faça upload de uma ou mais planilhas Excel (.xlsx ou .xls) com os dados dos pedidos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                  <span>O sistema analisará automaticamente os dados agrupando por cliente e pedido</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                  <span>Visualize os alertas de clientes com múltiplos pedidos distintos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">4</span>
                  <span>Exporte os resultados em formato CSV para análise posterior</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
