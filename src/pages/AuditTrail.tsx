import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Download, 
  ChevronDown, 
  ChevronRight,
  Clock,
  User,
  Bot,
  Satellite,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Printer,
  Share2
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { cn } from '@/lib/utils';

interface AuditStep {
  id: string;
  timestamp: string;
  type: 'system' | 'ai' | 'human' | 'satellite';
  title: string;
  description: string;
  details?: string[];
  status: 'completed' | 'warning' | 'error';
  expandable?: boolean;
}

const auditSteps: AuditStep[] = [
  {
    id: '1',
    timestamp: '2024-01-15 09:00:00',
    type: 'system',
    title: 'Claim Ingestion',
    description: 'ESG report received and parsed from AgroForest Inc annual sustainability disclosure.',
    details: [
      'Document format: PDF (42 pages)',
      'Language detected: English',
      'Claims identified: 23',
      'Priority claims flagged: 3'
    ],
    status: 'completed',
    expandable: true
  },
  {
    id: '2',
    timestamp: '2024-01-15 09:01:23',
    type: 'ai',
    title: 'NLP Claim Extraction',
    description: 'Vision-grounded NLP model extracted and classified environmental claims.',
    details: [
      'Model: PHAROS-NLP v2.3',
      'Confidence threshold: 0.85',
      'Claims extracted: "10,000 hectares reforested in São Paulo region"',
      'Claim category: Land Use / Biodiversity',
      'Specificity score: High (contains quantifiable metrics)'
    ],
    status: 'completed',
    expandable: true
  },
  {
    id: '3',
    timestamp: '2024-01-15 09:05:47',
    type: 'satellite',
    title: 'Satellite Data Retrieval',
    description: 'Sentinel-2 and SAR imagery retrieved for specified geographic region.',
    details: [
      'Data source: Sentinel-2 MSI, Sentinel-1 SAR',
      'Temporal range: Jan 2023 - Jan 2024',
      'Cloud-free observations: 24',
      'Spatial resolution: 10m (optical), 20m (SAR)',
      'Coverage: 100% of claimed area'
    ],
    status: 'completed',
    expandable: true
  },
  {
    id: '4',
    timestamp: '2024-01-15 09:12:33',
    type: 'ai',
    title: 'Change Detection Analysis',
    description: 'Multi-temporal analysis performed to detect land cover changes.',
    details: [
      'Algorithm: Deep Forest Change Detector v1.8',
      'NDVI baseline (Jan 2023): 0.72',
      'NDVI current (Jan 2024): 0.28',
      'Detected change: -61% vegetation index',
      'Anomaly flag: CRITICAL - Deforestation pattern detected'
    ],
    status: 'error',
    expandable: true
  },
  {
    id: '5',
    timestamp: '2024-01-15 09:15:00',
    type: 'ai',
    title: 'Integrity Gap Assessment',
    description: 'Cross-referencing claim against physical evidence revealed significant discrepancy.',
    details: [
      'Claimed: +10,000 ha reforestation',
      'Observed: -4,200 ha forest loss',
      'Discrepancy: 14,200 ha',
      'Integrity Score: 23/100',
      'Classification: GREENWASHING RISK - HIGH'
    ],
    status: 'error',
    expandable: true
  },
  {
    id: '6',
    timestamp: '2024-01-15 09:20:00',
    type: 'system',
    title: 'Report Generation',
    description: 'Automated preliminary assessment report generated for human review.',
    status: 'completed'
  },
  {
    id: '7',
    timestamp: '2024-01-15 14:30:00',
    type: 'human',
    title: 'Analyst Review',
    description: 'Senior ESG analyst reviewed findings and confirmed integrity gap classification.',
    details: [
      'Reviewer: Dr. Maria Santos',
      'Review duration: 45 minutes',
      'Decision: Confirmed - Integrity Gap',
      'Notes: "Clear evidence of net deforestation despite reforestation claims. Recommend escalation to regulatory affairs."'
    ],
    status: 'warning',
    expandable: true
  },
  {
    id: '8',
    timestamp: '2024-01-15 15:00:00',
    type: 'system',
    title: 'Escalation to Compliance',
    description: 'Case escalated to regulatory compliance team for potential enforcement action.',
    status: 'completed'
  }
];

const typeConfig = {
  system: { icon: FileText, color: 'text-muted-foreground', bg: 'bg-muted/50' },
  ai: { icon: Bot, color: 'text-primary', bg: 'bg-primary/10' },
  human: { icon: User, color: 'text-warning', bg: 'bg-warning/10' },
  satellite: { icon: Satellite, color: 'text-success', bg: 'bg-success/10' },
};

const AuditTrail = () => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['4', '5']));

  const toggleStep = (id: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AppLayout>
      {/* Header */}
      <motion.header 
        className="h-16 border-b border-border/30 glass-panel flex items-center justify-between px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-lg font-semibold text-foreground">Audit Trail & Explainability</h1>
          <p className="text-xs text-muted-foreground">Complete decision log for CLM-002 • AgroForest Inc</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Printer className="w-4 h-4" />
            Print
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
          <motion.button
            className="btn-neon flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export Artifacts
          </motion.button>
        </div>
      </motion.header>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Summary Card */}
          <motion.div 
            className="glass-panel-highlight p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-4 gap-6">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Claim ID</span>
                <p className="font-mono text-lg text-primary mt-1">CLM-002</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Steps</span>
                <p className="font-mono text-lg text-foreground mt-1">{auditSteps.length}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Processing Time</span>
                <p className="font-mono text-lg text-foreground mt-1">6h 00m</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Final Status</span>
                <span className="status-gap mt-1 inline-flex">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Integrity Gap
                </span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

            <div className="space-y-4">
              {auditSteps.map((step, index) => {
                const TypeIcon = typeConfig[step.type].icon;
                const isExpanded = expandedSteps.has(step.id);

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-12"
                  >
                    {/* Timeline node */}
                    <div className={cn(
                      "absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-2",
                      step.status === 'error' 
                        ? "border-danger bg-danger/20" 
                        : step.status === 'warning'
                        ? "border-warning bg-warning/20"
                        : "border-primary/50 bg-card"
                    )}>
                      <TypeIcon className={cn(
                        "w-4 h-4",
                        step.status === 'error' 
                          ? "text-danger" 
                          : step.status === 'warning'
                          ? "text-warning"
                          : typeConfig[step.type].color
                      )} />
                    </div>

                    {/* Content card */}
                    <div 
                      className={cn(
                        "glass-panel p-4 cursor-pointer transition-all",
                        step.expandable && "hover:border-primary/30",
                        step.status === 'error' && "border-danger/30",
                        step.status === 'warning' && "border-warning/30"
                      )}
                      onClick={() => step.expandable && toggleStep(step.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded",
                              typeConfig[step.type].bg,
                              typeConfig[step.type].color
                            )}>
                              {step.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.timestamp}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                        {step.expandable && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        )}
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {step.expandable && isExpanded && step.details && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                              {step.details.map((detail, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <span className="text-primary">•</span>
                                  <span className="text-muted-foreground font-mono text-xs">{detail}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Export Section */}
          <motion.div 
            className="mt-8 glass-panel p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Export Audit Artifacts
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Full Audit Report', format: 'PDF', size: '2.4 MB' },
                { label: 'Evidence Package', format: 'ZIP', size: '156 MB' },
                { label: 'Machine-Readable Log', format: 'JSON', size: '45 KB' },
              ].map((artifact, i) => (
                <motion.button
                  key={artifact.label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-all text-left group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-primary">{artifact.format}</span>
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-foreground block">{artifact.label}</span>
                  <span className="text-xs text-muted-foreground">{artifact.size}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AuditTrail;
