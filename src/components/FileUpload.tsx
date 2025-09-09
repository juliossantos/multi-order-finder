import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFilesSelected, isProcessing }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const processFiles = () => {
    onFilesSelected(selectedFiles);
  };

  return (
    <Card className="bg-gradient-card shadow-elegant border-border/50">
      <CardContent className="p-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            dragActive ? "border-primary bg-primary/5 shadow-glow" : "border-muted-foreground/25",
            isProcessing && "opacity-50 pointer-events-none"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Importar Planilhas de Pedidos
          </h3>
          <p className="text-muted-foreground mb-4">
            Arraste e solte arquivos .xlsx ou .xls aqui, ou clique para selecionar
          </p>
          
          <input
            type="file"
            multiple
            accept=".xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <Button 
            variant="outline" 
            className="cursor-pointer bg-yellow-400 hover:bg-yellow-500" 
            disabled={isProcessing}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Selecionar Arquivos
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="font-medium text-foreground">Arquivos Selecionados:</h4>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              onClick={processFiles}
              className="w-full mt-4 bg-red-600 hover:shadow-glow transition-all duration-200"
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Analisar Pedidos"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};