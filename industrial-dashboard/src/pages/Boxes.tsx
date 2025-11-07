import { BoxList } from '../components/boxes/BoxList';
import { PackageOpen } from 'lucide-react';

const Boxes = () => {
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <PackageOpen className="w-8 h-8 text-primary-foreground" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                Caixas de Armazenamento
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Monitore a capacidade e status das caixas
              </p>
            </div>
          </div>
        </div>

        {/* Boxes List */}
        <BoxList />
      </div>
    </div>
  );
};

export default Boxes;
