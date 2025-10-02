import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Camera, TrendingUp } from 'lucide-react';
import { usePhotoAnalysis, PhotoAnalysis } from '@/hooks/usePhotoAnalysis';

interface PhotoAnalyzerProps {
  propertyId?: string;
  onAnalysisComplete?: (analysis: PhotoAnalysis) => void;
}

export const PhotoAnalyzer = ({ propertyId, onAnalysisComplete }: PhotoAnalyzerProps) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const { analyzePhoto, isAnalyzing } = usePhotoAnalysis();

  const handleAnalyze = async () => {
    if (!photoUrl.trim()) return;

    const result = await analyzePhoto(photoUrl, propertyId);
    if (result) {
      setAnalysis(result);
      onAnalysisComplete?.(result);
    }
  };

  const getQualityColor = (quality: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
    const colors: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
      poor: 'destructive',
      fair: 'secondary',
      good: 'default',
      excellent: 'default',
      luxury: 'default',
    };
    return colors[quality] || 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Photo Analysis
        </CardTitle>
        <CardDescription>
          Analyze renovation photos to estimate quality and value impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter photo URL..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            disabled={isAnalyzing}
          />
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !photoUrl.trim()}>
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>

        {analysis && (
          <div className="space-y-4 animate-in fade-in-50">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quality Rating:</span>
                <Badge variant={getQualityColor(analysis.renovation_quality)}>
                  {analysis.renovation_quality.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Value Impact:</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-600">
                    +{analysis.estimated_value_impact}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence:</span>
                <span className="text-sm">{analysis.confidence_score}%</span>
              </div>
            </div>

            {analysis.rooms_identified.length > 0 && (
              <div>
                <span className="text-sm font-medium">Rooms Identified:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.rooms_identified.map((room, idx) => (
                    <Badge key={idx} variant="outline">{room}</Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.materials_detected.length > 0 && (
              <div>
                <span className="text-sm font-medium">Materials Detected:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.materials_detected.map((material, idx) => (
                    <Badge key={idx} variant="secondary">{material}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-sm font-medium">Analysis Notes:</span>
              <p className="text-sm text-muted-foreground mt-1">
                {analysis.detailed_notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
