import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PhotoAnalysis {
  renovation_quality: 'poor' | 'fair' | 'good' | 'excellent' | 'luxury';
  materials_detected: string[];
  rooms_identified: string[];
  estimated_value_impact: number;
  confidence_score: number;
  detailed_notes: string;
}

export const usePhotoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzePhoto = async (photoUrl: string, propertyId?: string): Promise<PhotoAnalysis | null> => {
    setIsAnalyzing(true);
    try {
      console.log('Starting photo analysis for:', photoUrl);

      const { data, error } = await supabase.functions.invoke('analyze-property-photo', {
        body: { photoUrl, propertyId },
      });

      if (error) {
        console.error('Error analyzing photo:', error);
        toast({
          title: 'Analysis Failed',
          description: error.message || 'Failed to analyze photo. Please try again.',
          variant: 'destructive',
        });
        return null;
      }

      console.log('Analysis result:', data);

      toast({
        title: 'Photo Analyzed',
        description: `Quality: ${data.analysis.renovation_quality} | Impact: +${data.analysis.estimated_value_impact}%`,
      });

      return data.analysis;
    } catch (error: any) {
      console.error('Error in analyzePhoto:', error);
      toast({
        title: 'Analysis Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPropertyAnalyses = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('photo_analyses')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPropertyAnalyses:', error);
      return [];
    }
  };

  return {
    analyzePhoto,
    getPropertyAnalyses,
    isAnalyzing,
  };
};
