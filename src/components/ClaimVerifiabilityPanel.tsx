import { motion } from 'framer-motion';
import { Scan, MapPin, Clock, CircleDot, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VerifiabilityData {
  observableModality: 'Optical (Sentinel-2)' | 'Radar (Sentinel-1)' | 'Text-Only' | 'Not Observable';
  spatialPrecision: 'Exact Facility' | 'Approximate Region' | 'Unknown';
  temporalPrecision: 'Exact Year' | 'Time Window' | 'Vague';
  overallVerifiability: 'High' | 'Medium' | 'Low';
}

const verifiabilityByClaimId: Record<string, VerifiabilityData> = {
  '1': {
    observableModality: 'Optical (Sentinel-2)',
    spatialPrecision: 'Exact Facility',
    temporalPrecision: 'Exact Year',
    overallVerifiability: 'High',
  },
  '2': {
    observableModality: 'Optical (Sentinel-2)',
    spatialPrecision: 'Approximate Region',
    temporalPrecision: 'Time Window',
    overallVerifiability: 'Medium',
  },
  '3': {
    observableModality: 'Text-Only',
    spatialPrecision: 'Unknown',
    temporalPrecision: 'Vague',
    overallVerifiability: 'Low',
  },
  '4': {
    observableModality: 'Radar (Sentinel-1)',
    spatialPrecision: 'Exact Facility',
    temporalPrecision: 'Exact Year',
    overallVerifiability: 'High',
  },
  '5': {
    observableModality: 'Not Observable',
    spatialPrecision: 'Unknown',
    temporalPrecision: 'Vague',
    overallVerifiability: 'Low',
  },
};

const verifiabilityColors = {
  High: 'text-success bg-success/10 border-success/30',
  Medium: 'text-warning bg-warning/10 border-warning/30',
  Low: 'text-danger bg-danger/10 border-danger/30',
};

interface ClaimVerifiabilityPanelProps {
  selectedClaim: string | null;
}

export const ClaimVerifiabilityPanel = ({ selectedClaim }: ClaimVerifiabilityPanelProps) => {
  const data = selectedClaim ? verifiabilityByClaimId[selectedClaim] : null;

  if (!data) return null;

  return (
    <motion.div
      className="glass-panel p-4 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Scan className="w-4 h-4 text-primary" />
          Claim Verifiability Assessment
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[260px]">
              <p className="text-xs">
                Assesses whether the claim can be independently evaluated using publicly available physical or textual evidence. This does not imply factual truth.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {/* Observable Modality */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <CircleDot className="w-3.5 h-3.5" />
            Observable Modality
          </span>
          <span className="font-mono text-xs text-foreground/80">{data.observableModality}</span>
        </div>

        {/* Spatial Precision */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Spatial Precision
          </span>
          <span className="font-mono text-xs text-foreground/80">{data.spatialPrecision}</span>
        </div>

        {/* Temporal Precision */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Temporal Precision
          </span>
          <span className="font-mono text-xs text-foreground/80">{data.temporalPrecision}</span>
        </div>

        {/* Overall Verifiability */}
        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Verifiability</span>
            <span className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium border",
              verifiabilityColors[data.overallVerifiability]
            )}>
              {data.overallVerifiability}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
