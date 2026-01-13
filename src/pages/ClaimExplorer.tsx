import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  MapPin, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowUpDown
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { RegulatoryDisclaimer } from '@/components/RegulatoryDisclaimer';

interface Claim {
  id: string;
  company: string;
  claim: string;
  location: string;
  date: string;
  status: 'verified' | 'review' | 'gap';
  confidence: number;
  sector: string;
  riskLevel: 'low' | 'medium' | 'high';
  verifiabilityClass: 'Physically Groundable' | 'Indirectly Groundable' | 'Text-Only' | 'Not Verifiable';
}

const mockClaims: Claim[] = [
  { id: 'CLM-001', company: 'GreenTech Solutions', claim: 'Carbon neutral operations by 2023', location: 'Singapore', date: '2024-01-15', status: 'verified', confidence: 94, sector: 'Technology', riskLevel: 'low', verifiabilityClass: 'Indirectly Groundable' },
  { id: 'CLM-002', company: 'AgroForest Inc', claim: '10,000 hectares reforested', location: 'São Paulo, Brazil', date: '2024-01-12', status: 'gap', confidence: 23, sector: 'Agriculture', riskLevel: 'high', verifiabilityClass: 'Physically Groundable' },
  { id: 'CLM-003', company: 'Nordic Energy', claim: '100% renewable energy usage', location: 'Berlin, Germany', date: '2024-01-10', status: 'review', confidence: 67, sector: 'Energy', riskLevel: 'medium', verifiabilityClass: 'Indirectly Groundable' },
  { id: 'CLM-004', company: 'Pacific Fisheries', claim: 'Sustainable fishing practices', location: 'Tokyo, Japan', date: '2024-01-08', status: 'verified', confidence: 89, sector: 'Food & Agriculture', riskLevel: 'low', verifiabilityClass: 'Text-Only' },
  { id: 'CLM-005', company: 'EcoMine Corp', claim: 'Zero waste to landfill', location: 'Sydney, Australia', date: '2024-01-05', status: 'review', confidence: 71, sector: 'Mining', riskLevel: 'medium', verifiabilityClass: 'Indirectly Groundable' },
  { id: 'CLM-006', company: 'CleanWater Systems', claim: 'Water recycling at 95%', location: 'Mumbai, India', date: '2024-01-03', status: 'verified', confidence: 91, sector: 'Utilities', riskLevel: 'low', verifiabilityClass: 'Indirectly Groundable' },
  { id: 'CLM-007', company: 'BioFuel Dynamics', claim: 'Carbon-negative fuel production', location: 'Houston, USA', date: '2024-01-02', status: 'gap', confidence: 31, sector: 'Energy', riskLevel: 'high', verifiabilityClass: 'Not Verifiable' },
  { id: 'CLM-008', company: 'Terra Construction', claim: 'Sustainable building materials', location: 'Dubai, UAE', date: '2023-12-28', status: 'review', confidence: 58, sector: 'Construction', riskLevel: 'medium', verifiabilityClass: 'Text-Only' },
];

const statusConfig = {
  verified: { label: 'Verified', icon: CheckCircle2, class: 'status-verified' },
  review: { label: 'Under Review', icon: Clock, class: 'status-review' },
  gap: { label: 'Integrity Gap', icon: AlertTriangle, class: 'status-gap' },
};

const riskColors = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-danger',
};

const ClaimExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Claim>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredClaims = mockClaims
    .filter(claim => {
      const matchesSearch = claim.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           claim.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           claim.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aVal > bVal ? direction : -direction;
    });

  const handleSort = (field: keyof Claim) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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
          <h1 className="text-lg font-semibold text-foreground">Claim Explorer</h1>
          <p className="text-xs text-muted-foreground">Filter, search, and analyze ESG claims across your portfolio</p>
        </div>
        <motion.button
          className="btn-ghost-neon flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          Export Data
        </motion.button>
      </motion.header>

      {/* Filters Bar */}
      <motion.div 
        className="px-6 py-4 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search claims, companies, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="review">Under Review</option>
            <option value="gap">Integrity Gap</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* More Filters */}
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-4 h-4" />
          More Filters
        </motion.button>

        {/* Results count */}
        <div className="text-sm text-muted-foreground ml-auto">
          <span className="text-foreground font-medium">{filteredClaims.length}</span> claims found
        </div>
      </motion.div>

      {/* Claims Table */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <motion.div 
          className="h-full glass-panel overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-auto h-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/30">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button onClick={() => handleSort('id')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                      Claim ID <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button onClick={() => handleSort('company')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                      Company <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider max-w-[250px]">
                    Claim Statement
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                      Status <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button onClick={() => handleSort('confidence')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                      Confidence <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Verifiability
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredClaims.map((claim, index) => {
                  const StatusIcon = statusConfig[claim.status].icon;
                  return (
                    <motion.tr
                      key={claim.id}
                      className="hover:bg-muted/30 transition-colors group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-primary">{claim.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{claim.company}</span>
                        <span className="block text-xs text-muted-foreground">{claim.sector}</span>
                      </td>
                      <td className="px-4 py-3 max-w-[250px]">
                        <span className="text-sm text-foreground/80 line-clamp-2">{claim.claim}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {claim.location}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={statusConfig[claim.status].class}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig[claim.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className={cn(
                                "h-full rounded-full",
                                claim.confidence >= 70 ? "bg-success" : claim.confidence >= 40 ? "bg-warning" : "bg-danger"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${claim.confidence}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 }}
                            />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{claim.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-medium uppercase", riskColors[claim.riskLevel])}>
                          {claim.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground" title="Claim Verifiability Estimator (CVE) classification">
                          {claim.verifiabilityClass}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to="/evidence">
                          <motion.button
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Analyze <ExternalLink className="w-3 h-3" />
                          </motion.button>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      
      {/* Regulatory Disclaimer Footer */}
      <RegulatoryDisclaimer />
    </AppLayout>
  );
};

export default ClaimExplorer;
