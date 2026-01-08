import { motion } from 'framer-motion';
import { FileText, ChevronRight, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface Claim {
  id: string;
  text: string;
  status: 'verified' | 'review' | 'gap';
  location?: string;
}

interface DocumentViewerProps {
  selectedClaim: string | null;
  onClaimSelect: (id: string) => void;
}

const claims: Claim[] = [
  {
    id: '1',
    text: 'Our Singapore facility has achieved carbon neutrality through certified renewable energy procurement.',
    status: 'verified',
    location: 'Singapore Facility',
  },
  {
    id: '2',
    text: 'We have protected over 50,000 hectares of Amazon rainforest through our conservation partnership.',
    status: 'gap',
    location: 'São Paulo Forest',
  },
  {
    id: '3',
    text: 'All European operations utilize 100% recycled materials in production processes.',
    status: 'review',
    location: 'Berlin Operations',
  },
  {
    id: '4',
    text: 'Our Tokyo manufacturing plant operates with zero waste-to-landfill certification.',
    status: 'verified',
    location: 'Tokyo Plant',
  },
  {
    id: '5',
    text: 'Water consumption in our Sydney hub has been reduced by 40% since 2020.',
    status: 'review',
    location: 'Sydney Hub',
  },
];

const StatusIcon = ({ status }: { status: Claim['status'] }) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'review':
      return <HelpCircle className="w-4 h-4 text-warning" />;
    case 'gap':
      return <AlertCircle className="w-4 h-4 text-danger" />;
  }
};

const StatusBadge = ({ status }: { status: Claim['status'] }) => {
  const baseClasses = "text-xs font-medium";
  switch (status) {
    case 'verified':
      return <span className={`status-verified pulse-success ${baseClasses}`}><CheckCircle className="w-3 h-3" /> Verified</span>;
    case 'review':
      return <span className={`status-review pulse-warning ${baseClasses}`}><HelpCircle className="w-3 h-3" /> Review</span>;
    case 'gap':
      return <span className={`status-gap pulse-danger ${baseClasses}`}><AlertCircle className="w-3 h-3" /> Gap</span>;
  }
};

export const DocumentViewer = ({ selectedClaim, onClaimSelect }: DocumentViewerProps) => {
  return (
    <motion.div 
      className="h-full flex flex-col glass-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">ESG Sustainability Report</h2>
            <p className="text-xs text-muted-foreground">AcmeCorp Annual Disclosure 2024</p>
          </div>
        </div>
      </div>

      {/* Document content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <motion.div 
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.p 
            className="text-sm text-muted-foreground leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            This sustainability report outlines our environmental commitments and achievements across global operations. The following claims have been analyzed for integrity verification.
          </motion.p>

          {claims.map((claim, index) => (
            <motion.div
              key={claim.id}
              className={`relative p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedClaim === claim.id 
                  ? 'glass-panel-highlight' 
                  : 'hover:bg-muted/30'
              }`}
              onClick={() => onClaimSelect(claim.id)}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusIcon status={claim.status} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${
                    selectedClaim === claim.id ? 'claim-highlight' : ''
                  }`}>
                    {claim.text}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{claim.location}</span>
                    <StatusBadge status={claim.status} />
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                  selectedClaim === claim.id ? 'rotate-90 text-primary' : ''
                }`} />
              </div>
              
              {selectedClaim === claim.id && (
                <motion.div 
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.05), transparent)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground italic">
            Click on any claim to inspect evidence and verification status in the intelligence panel.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export { claims };
export type { Claim };
