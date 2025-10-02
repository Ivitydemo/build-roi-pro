import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image as ImageIcon, TrendingUp } from 'lucide-react';
import { usePhotoAnalysis } from '@/hooks/usePhotoAnalysis';

interface PropertyPhotoAnalysisProps {
  propertyId: string;
}

export const PropertyPhotoAnalysis = ({ propertyId }: PropertyPhotoAnalysisProps) => {
  const { analyzePhoto, getPropertyAnalyses, isAnalyzing } = usePhotoAnalysis();
  const [photoUrl, setPhotoUrl] = useState('');
  const [analyses, setAnalyses] = useState<any[]>([]);

  useEffect(() => {
    loadAnalyses();
  }, [propertyId]);

  const loadAnalyses = async () => {
    const data = await getPropertyAnalyses(propertyId);
    setAnalyses(data);
  };

  const handleAnalyze = async () => {
    if (!photoUrl.trim()) return;

    const result = await analyzePhoto(photoUrl, propertyId);
    if (result) {
      setPhotoUrl('');
      loadAnalyses();
    }
  };

  const getQualityColor = (quality: string) => {
    const colors: Record<string, string> = {
      luxury: 'bg-purple-500',
      excellent: 'bg-blue-500',
      good: 'bg-green-500',
      fair: 'bg-yellow-500',
      poor: 'bg-red-500'
    };
    return colors[quality] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          AI Photo Analysis
        </CardTitle>
        <CardDescription>
          Analyze renovation photos to enhance ARV accuracy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload/Analyze Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter photo URL to analyze..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            disabled={isAnalyzing}
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !photoUrl.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>

        {/* Previous Analyses */}
        {analyses.length > 0 && (
          <div className="space-y-3 mt-6">
            <h3 className="text-sm font-semibold">Previous Analyses</h3>
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="border">
                <CardContent className="pt-4 space-y-3">
                  {/* Photo Preview */}
                  <img 
                    src={analysis.photo_url} 
                    alt="Analyzed property" 
                    className="w-full h-48 object-cover rounded-md"
                  />

                  {/* Quality & Impact */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getQualityColor(analysis.renovation_quality)}>
                        {analysis.renovation_quality}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Confidence: {(analysis.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      +{analysis.estimated_value_impact}% value
                    </div>
                  </div>

                  {/* Rooms & Materials */}
                  <div className="space-y-2">
                    {analysis.rooms_identified?.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Rooms: </span>
                        {analysis.rooms_identified.map((room: string) => (
                          <Badge key={room} variant="outline" className="ml-1">
                            {room}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {analysis.materials_detected?.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Materials: </span>
                        {analysis.materials_detected.map((material: string) => (
                          <Badge key={material} variant="secondary" className="ml-1">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Detailed Notes */}
                  {analysis.analysis_data?.detailed_notes && (
                    <div className="space-y-1 border-t pt-3">
                      <span className="text-xs font-semibold">Analysis Notes:</span>
                      <p className="text-sm text-muted-foreground">
                        {analysis.analysis_data.detailed_notes}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Analyzed: {new Date(analysis.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {analyses.length === 0 && !isAnalyzing && (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No analyses yet. Add a photo URL above to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
