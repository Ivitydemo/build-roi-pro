import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, CheckCircle, Home } from 'lucide-react';

interface ComparableWithAnalysisProps {
  address: string;
  price: number;
  sqft: number;
  priceSqft: number;
  distance: number;
  analysis?: {
    quality: 'Budget' | 'Standard' | 'Premium' | 'Luxury';
    renovationStatus: 'Original' | 'Partially Updated' | 'Fully Renovated';
    renovatedAreas?: string[]; // e.g., ['Kitchen', 'Master Bath', 'Flooring']
    materials: string[];
    valueDrivers: string[];
    estimatedImpact?: number;
    photoUrl?: string; // Optional property photo
  };
}

export const ComparableWithAnalysis = ({
  address,
  price,
  sqft,
  priceSqft,
  distance,
  analysis
}: ComparableWithAnalysisProps) => {
  const qualityColor = {
    'Budget': 'bg-gray-100 text-gray-700 border-gray-300',
    'Standard': 'bg-blue-100 text-blue-700 border-blue-300',
    'Premium': 'bg-purple-100 text-purple-700 border-purple-300',
    'Luxury': 'bg-amber-100 text-amber-700 border-amber-300'
  };

  const renovationColor = {
    'Original': 'bg-red-50 text-red-700 border-red-200',
    'Partially Updated': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Fully Renovated': 'bg-green-50 text-green-700 border-green-200'
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="font-semibold text-lg mb-1">{address}</div>
          <div className="text-sm text-muted-foreground">
            {distance} miles away • {sqft.toLocaleString()} sq ft
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">${price.toLocaleString()}</div>
          <div className="text-sm font-semibold text-primary">${priceSqft}/sqft</div>
        </div>
      </div>

      {analysis && (
        <div className="space-y-3 mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={`${qualityColor[analysis.quality]} border`}>
              {analysis.quality} Quality
            </Badge>
            <Badge className={`${renovationColor[analysis.renovationStatus]} border`}>
              {analysis.renovationStatus}
            </Badge>
          </div>

          {analysis.renovatedAreas && analysis.renovatedAreas.length > 0 && (
            <div className="text-sm bg-muted/50 rounded-md p-3">
              <div className="font-medium mb-1 flex items-center gap-1">
                <Home className="h-3 w-3 text-primary" />
                Renovated Areas:
              </div>
              <div className="text-muted-foreground">
                {analysis.renovatedAreas.join(', ')}
              </div>
            </div>
          )}

          {analysis.materials.length > 0 && (
            <div className="text-sm">
              <div className="font-medium mb-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Key Materials:
              </div>
              <div className="text-muted-foreground pl-4">
                {analysis.materials.join(' • ')}
              </div>
            </div>
          )}

          {analysis.valueDrivers.length > 0 && (
            <div className="text-sm">
              <div className="font-medium mb-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                Value Drivers:
              </div>
              <ul className="text-muted-foreground pl-4 space-y-1">
                {analysis.valueDrivers.map((driver, idx) => (
                  <li key={idx} className="list-disc ml-4">{driver}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.estimatedImpact && (
            <div className="bg-primary/5 rounded-md p-2 text-sm">
              <span className="font-medium">Renovation Value Impact:</span>{' '}
              <span className="text-primary font-semibold">
                +${analysis.estimatedImpact.toLocaleString()} vs. non-renovated comparable
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
