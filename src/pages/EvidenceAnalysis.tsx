import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Satellite, 
  Calendar, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Radar,
  Download,
  ChevronRight,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { cn } from '@/lib/utils';
import { DataCoveragePanel } from '@/components/DataCoveragePanel';
import { RegulatoryDisclaimer } from '@/components/RegulatoryDisclaimer';

// Mock claims data - should match ClaimExplorer
const claimsData: Record<string, {
  id: string;
  company: string;
  claim: string;
  location: string;
  coordinates: string;
  date: string;
  status: 'verified' | 'review' | 'gap';
  confidence: number;
  sector: string;
  dataSources: string[];
}> = {
  'CLM-001': { id: 'CLM-001', company: 'GreenTech Solutions', claim: 'Carbon neutral operations by 2023', location: 'Singapore', coordinates: '1.3521° N, 103.8198° E', date: '2024-01-15', status: 'verified', confidence: 94, sector: 'Technology', dataSources: ['Sentinel-2', 'ESG Report p.12'] },
  'CLM-002': { id: 'CLM-002', company: 'AgroForest Inc', claim: '10,000 hectares reforested', location: 'São Paulo, Brazil', coordinates: '-23.5505° S, -46.6333° W', date: '2024-01-12', status: 'gap', confidence: 23, sector: 'Agriculture', dataSources: ['Sentinel-2', 'Sentinel-1', 'ESG Report p.45'] },
  'CLM-003': { id: 'CLM-003', company: 'Nordic Energy', claim: '100% renewable energy usage', location: 'Berlin, Germany', coordinates: '52.5200° N, 13.4050° E', date: '2024-01-10', status: 'review', confidence: 67, sector: 'Energy', dataSources: ['Grid Data', 'ESG Report p.8'] },
  'CLM-004': { id: 'CLM-004', company: 'Pacific Fisheries', claim: 'Sustainable fishing practices', location: 'Tokyo, Japan', coordinates: '35.6762° N, 139.6503° E', date: '2024-01-08', status: 'verified', confidence: 89, sector: 'Food & Agriculture', dataSources: ['Vessel Tracking', 'ESG Report p.22'] },
  'CLM-005': { id: 'CLM-005', company: 'EcoMine Corp', claim: 'Zero waste to landfill', location: 'Sydney, Australia', coordinates: '-33.8688° S, 151.2093° E', date: '2024-01-05', status: 'review', confidence: 71, sector: 'Mining', dataSources: ['Sentinel-2', 'ESG Report p.31'] },
  'CLM-006': { id: 'CLM-006', company: 'CleanWater Systems', claim: 'Water recycling at 95%', location: 'Mumbai, India', coordinates: '19.0760° N, 72.8777° E', date: '2024-01-03', status: 'verified', confidence: 91, sector: 'Utilities', dataSources: ['Facility Data', 'ESG Report p.15'] },
  'CLM-007': { id: 'CLM-007', company: 'BioFuel Dynamics', claim: 'Carbon-negative fuel production', location: 'Houston, USA', coordinates: '29.7604° N, -95.3698° W', date: '2024-01-02', status: 'gap', confidence: 31, sector: 'Energy', dataSources: ['Sentinel-1', 'ESG Report p.67'] },
  'CLM-008': { id: 'CLM-008', company: 'Terra Construction', claim: 'Sustainable building materials', location: 'Dubai, UAE', coordinates: '25.2048° N, 55.2708° E', date: '2023-12-28', status: 'review', confidence: 58, sector: 'Construction', dataSources: ['Supplier Data', 'ESG Report p.41'] },
};

const statusConfig = {
  verified: { label: 'Verified', icon: CheckCircle2, class: 'status-verified' },
  review: { label: 'Under Review', icon: Clock, class: 'status-review' },
  gap: { label: 'Integrity Gap', icon: AlertTriangle, class: 'status-gap' },
};

import { AlertTriangle } from 'lucide-react';

const EvidenceAnalysis = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const [activeLayer, setActiveLayer] = useState<'rgb' | 'ndvi' | 'sar'>('rgb');
  const [selectedDate, setSelectedDate] = useState('2024-01');
  const [comparisonDate, setComparisonDate] = useState('2023-01');

  // Get claim data based on URL parameter, default to CLM-002
  const currentClaim = claimsData[claimId || 'CLM-002'] || claimsData['CLM-002'];
  const StatusIcon = statusConfig[currentClaim.status].icon;

  const dataQualityIndicators = [
    { label: 'Cloud Coverage', value: 12, max: 100, unit: '%', status: 'good' },
    { label: 'Resolution', value: 10, unit: 'm', status: 'good' },
    { label: 'Temporal Gap', value: 3, unit: 'days', status: 'warning' },
    { label: 'Data Freshness', value: 2, unit: 'days ago', status: 'good' },
  ];

  const ndviData = [
    { month: 'Jan', before: 0.65, after: 0.42 },
    { month: 'Feb', before: 0.68, after: 0.38 },
    { month: 'Mar', before: 0.71, after: 0.35 },
    { month: 'Apr', before: 0.74, after: 0.31 },
    { month: 'May', before: 0.72, after: 0.28 },
    { month: 'Jun', before: 0.69, after: 0.25 },
  ];

  const sarMetrics = [
    { label: 'Backscatter Intensity', change: -23, unit: 'dB' },
    { label: 'Coherence', change: -45, unit: '%' },
    { label: 'Polarimetric Entropy', change: +67, unit: '%' },
  ];

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <motion.div 
        className="px-6 py-2 border-b border-border/20 flex items-center gap-2 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Link to="/claims" className="text-muted-foreground hover:text-primary transition-colors">
          Claim Explorer
        </Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-primary font-mono">{currentClaim.id}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-foreground">Evidence Analysis</span>
      </motion.div>

      {/* Header */}
      <motion.header 
        className="h-16 border-b border-border/30 glass-panel flex items-center justify-between px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-lg font-semibold text-foreground">Evidence Analysis</h1>
          <p className="text-xs text-muted-foreground">{currentClaim.id} • {currentClaim.company} - {currentClaim.claim}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={statusConfig[currentClaim.status].class}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig[currentClaim.status].label}
          </span>
          <motion.button
            className="btn-neon flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
        </div>
      </motion.header>

      {/* Claim Context Card */}
      <motion.div 
        className="mx-6 mt-4 glass-panel p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Claim Context
        </h3>
        <div className="grid grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block mb-1">Claim ID</span>
            <span className="text-primary font-mono">{currentClaim.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">Company</span>
            <span className="text-foreground">{currentClaim.company}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block mb-1">Claim Statement</span>
            <span className="text-foreground">{currentClaim.claim}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </span>
            <span className="text-foreground">{currentClaim.location}</span>
            <span className="text-muted-foreground block text-[10px]">{currentClaim.coordinates}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">Data Sources</span>
            <div className="flex flex-wrap gap-1">
              {currentClaim.dataSources.map((source) => (
                <span key={source} className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px] text-foreground/80">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-12 gap-6 h-full min-h-[800px]">
          {/* Left Column - Satellite Comparison */}
          <div className="col-span-8 flex flex-col gap-6">
            {/* Layer Controls */}
            <motion.div 
              className="glass-panel p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Visualization Layer:</span>
                <div className="flex rounded-lg overflow-hidden border border-border/50">
                  {(['rgb', 'ndvi', 'sar'] as const).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setActiveLayer(layer)}
                      className={cn(
                        "px-4 py-1.5 text-xs font-medium uppercase transition-all",
                        activeLayer === layer 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Satellite Image Comparison */}
            <motion.div 
              className="flex-1 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Before Image */}
              <div className="glass-panel overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Before: {comparisonDate}</span>
                  </div>
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Dense Forest
                  </span>
                </div>
                <div className="flex-1 relative bg-gradient-to-br from-success/20 via-success/10 to-success/5 min-h-[300px]">
                  {/* Simulated satellite view - healthy forest */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full overflow-hidden">
                      {/* Forest texture simulation */}
                      <div className="absolute inset-0 opacity-60">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full bg-success/30"
                            style={{
                              width: `${Math.random() * 40 + 20}px`,
                              height: `${Math.random() * 40 + 20}px`,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Satellite className="w-12 h-12 text-success/40" />
                      </div>
                    </div>
                  </div>
                  {/* NDVI indicator */}
                  <div className="absolute bottom-4 left-4 glass-panel px-3 py-2">
                    <span className="text-xs text-muted-foreground">Avg NDVI:</span>
                    <span className="text-sm font-mono text-success ml-2">0.72</span>
                  </div>
                </div>
              </div>

              {/* After Image */}
              <div className="glass-panel overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">After: {selectedDate}</span>
                  </div>
                  <span className="text-xs text-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Deforestation Detected
                  </span>
                </div>
                <div className="flex-1 relative bg-gradient-to-br from-danger/20 via-warning/10 to-muted/5 min-h-[300px]">
                  {/* Simulated satellite view - cleared area */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full overflow-hidden">
                      {/* Cleared area simulation */}
                      <div className="absolute inset-0 opacity-40">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full bg-warning/20"
                            style={{
                              width: `${Math.random() * 30 + 10}px`,
                              height: `${Math.random() * 30 + 10}px`,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                      {/* Cleared patch */}
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-danger/20 border-2 border-danger/50 border-dashed rounded-lg flex items-center justify-center">
                        <span className="text-danger text-xs font-medium">-4,200 ha</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Satellite className="w-12 h-12 text-danger/40" />
                      </div>
                    </div>
                  </div>
                  {/* NDVI indicator */}
                  <div className="absolute bottom-4 left-4 glass-panel px-3 py-2">
                    <span className="text-xs text-muted-foreground">Avg NDVI:</span>
                    <span className="text-sm font-mono text-danger ml-2">0.28</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* NDVI Chart */}
              <motion.div 
                className="glass-panel p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">NDVI Trend Analysis</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">Baseline</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-danger" />
                      <span className="text-muted-foreground">Current</span>
                    </div>
                  </div>
                </div>
                <div className="h-40 flex items-end gap-2">
                  {ndviData.map((d, i) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 h-32">
                        <motion.div 
                          className="flex-1 bg-success/60 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: `${d.before * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        />
                        <motion.div 
                          className="flex-1 bg-danger/60 rounded-t"
                          initial={{ height: 0 }}
                          animate={{ height: `${d.after * 100}%` }}
                          transition={{ delay: i * 0.1 + 0.05, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{d.month}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* SAR Metrics */}
              <motion.div 
                className="glass-panel p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Radar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">SAR Change Detection</span>
                </div>
                <div className="space-y-4">
                  {sarMetrics.map((metric, i) => (
                    <motion.div 
                      key={metric.label}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        {metric.change > 0 ? (
                          <TrendingUp className="w-4 h-4 text-danger" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-danger" />
                        )}
                        <span className={cn(
                          "font-mono text-sm",
                          metric.change > 0 ? "text-danger" : "text-danger"
                        )}>
                          {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    <AlertCircle className="w-3 h-3 inline mr-1 text-warning" />
                    High entropy increase indicates significant structural change in vegetation canopy.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Data Quality & Metrics */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* Data Quality Indicators */}
            <motion.div 
              className="glass-panel p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Data Quality Assessment
              </h3>
              <div className="space-y-4">
                {dataQualityIndicators.map((indicator, i) => (
                  <motion.div 
                    key={indicator.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">{indicator.label}</span>
                      <span className={cn(
                        "text-xs font-mono",
                        indicator.status === 'good' ? "text-success" : "text-warning"
                      )}>
                        {indicator.value}{indicator.unit}
                      </span>
                    </div>
                    {indicator.max && (
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            indicator.status === 'good' ? "bg-success" : "bg-warning"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${(indicator.value / indicator.max) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Evidence Summary */}
            <motion.div 
              className="glass-panel-highlight p-4 flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-medium text-foreground mb-4">Evidence Summary</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-danger">Material Inconsistency Detected</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Satellite imagery shows 42% reduction in forest cover compared to baseline, 
                        contradicting the claim of 10,000 hectares reforestation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Claimed Area</span>
                    <span className="font-mono text-foreground">10,000 ha</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Verified Forest Cover</span>
                    <span className="font-mono text-danger">5,800 ha</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discrepancy</span>
                    <span className="font-mono text-danger">-4,200 ha</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/30">
                    <span className="text-muted-foreground">Confidence Level</span>
                    <span className="font-mono text-warning">High (87%)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">Recommendation</span>
                  <p className="text-sm text-foreground mt-1">
                    Request ground-truth validation and third-party audit of reforestation claims.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Data Coverage & Uncertainty Panel */}
            <DataCoveragePanel />
          </div>
        </div>
      </div>
      
      {/* Regulatory Disclaimer Footer */}
      <RegulatoryDisclaimer />
    </AppLayout>
  );
};

export default EvidenceAnalysis;
