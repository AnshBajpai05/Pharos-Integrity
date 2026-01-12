import { motion } from 'framer-motion';
import { 
  Building2, 
  Globe2, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Filter
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Company {
  id: string;
  name: string;
  sector: string;
  integrityScore: number;
  trend: 'up' | 'down' | 'stable';
  claims: { verified: number; review: number; gap: number };
  locations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const companies: Company[] = [
  { 
    id: '1', name: 'GreenTech Solutions', sector: 'Technology', 
    integrityScore: 94, trend: 'up', 
    claims: { verified: 12, review: 2, gap: 0 },
    locations: ['Singapore', 'Berlin', 'Tokyo'],
    riskLevel: 'low'
  },
  { 
    id: '2', name: 'AgroForest Inc', sector: 'Agriculture', 
    integrityScore: 23, trend: 'down', 
    claims: { verified: 3, review: 4, gap: 8 },
    locations: ['São Paulo', 'Buenos Aires'],
    riskLevel: 'high'
  },
  { 
    id: '3', name: 'Nordic Energy', sector: 'Energy', 
    integrityScore: 78, trend: 'stable', 
    claims: { verified: 8, review: 5, gap: 1 },
    locations: ['Oslo', 'Stockholm', 'Copenhagen'],
    riskLevel: 'medium'
  },
  { 
    id: '4', name: 'Pacific Fisheries', sector: 'Food & Agriculture', 
    integrityScore: 89, trend: 'up', 
    claims: { verified: 15, review: 3, gap: 0 },
    locations: ['Tokyo', 'Sydney', 'Auckland'],
    riskLevel: 'low'
  },
  { 
    id: '5', name: 'EcoMine Corp', sector: 'Mining', 
    integrityScore: 61, trend: 'down', 
    claims: { verified: 5, review: 8, gap: 4 },
    locations: ['Perth', 'Johannesburg'],
    riskLevel: 'medium'
  },
];

const regionData = [
  { region: 'Asia Pacific', companies: 8, avgScore: 82, claims: 45 },
  { region: 'Europe', companies: 12, avgScore: 76, claims: 67 },
  { region: 'North America', companies: 6, avgScore: 71, claims: 34 },
  { region: 'South America', companies: 4, avgScore: 45, claims: 28 },
  { region: 'Africa', companies: 3, avgScore: 58, claims: 15 },
];

const PortfolioOverview = () => {
  const totalClaims = companies.reduce((acc, c) => acc + c.claims.verified + c.claims.review + c.claims.gap, 0);
  const avgScore = Math.round(companies.reduce((acc, c) => acc + c.integrityScore, 0) / companies.length);
  const gapCount = companies.reduce((acc, c) => acc + c.claims.gap, 0);

  return (
    <AppLayout>
      {/* Header */}
      <motion.header 
        className="h-16 border-b border-border/30 glass-panel flex items-center justify-between px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-lg font-semibold text-foreground">Portfolio Overview</h1>
          <p className="text-xs text-muted-foreground">Company-level integrity summary across your investment portfolio</p>
        </div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Filter className="w-4 h-4" />
          Filter Portfolio
        </motion.button>
      </motion.header>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Summary Stats */}
        <motion.div 
          className="grid grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: 'Total Companies', value: companies.length, icon: Building2, color: 'text-primary', tooltip: '' },
            { label: 'Average Integrity', value: `${avgScore}%`, icon: CheckCircle2, color: 'text-success', tooltip: 'Weighted by claim materiality and verifiability confidence.' },
            { label: 'Total Claims', value: totalClaims, icon: Globe2, color: 'text-foreground', tooltip: '' },
            { label: 'Active Gaps', value: gapCount, icon: AlertTriangle, color: 'text-danger', tooltip: '' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-panel p-4 card-lift relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="counter-value text-2xl">{stat.value}</p>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              {stat.tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-xs text-muted-foreground max-w-[200px] text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {stat.tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Companies List */}
          <div className="col-span-8">
            <motion.div 
              className="glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Portfolio Companies</h3>
                <span className="text-xs text-muted-foreground">{companies.length} companies</span>
              </div>
              <div className="divide-y divide-border/20">
                {companies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    className="p-4 hover:bg-muted/20 transition-colors cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Company Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{company.name}</span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded uppercase font-medium",
                            company.riskLevel === 'low' ? "bg-success/20 text-success" :
                            company.riskLevel === 'medium' ? "bg-warning/20 text-warning" :
                            "bg-danger/20 text-danger"
                          )}>
                            {company.riskLevel} risk
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{company.sector}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.locations.slice(0, 2).join(', ')}
                            {company.locations.length > 2 && ` +${company.locations.length - 2}`}
                          </span>
                        </div>
                      </div>

                      {/* Integrity Score */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              "font-mono text-lg font-bold",
                              company.integrityScore >= 70 ? "text-success" :
                              company.integrityScore >= 40 ? "text-warning" :
                              "text-danger"
                            )}>
                              {company.integrityScore}
                            </span>
                            {company.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                            {company.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger" />}
                          </div>
                          <span className="text-[10px] text-muted-foreground">Integrity Score</span>
                        </div>
                        <div className="w-16 h-16 relative">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="32" cy="32" r="28"
                              className="fill-none stroke-muted"
                              strokeWidth="4"
                            />
                            <motion.circle
                              cx="32" cy="32" r="28"
                              className={cn(
                                "fill-none",
                                company.integrityScore >= 70 ? "stroke-success" :
                                company.integrityScore >= 40 ? "stroke-warning" :
                                "stroke-danger"
                              )}
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${company.integrityScore * 1.76} 176`}
                              initial={{ strokeDasharray: "0 176" }}
                              animate={{ strokeDasharray: `${company.integrityScore * 1.76} 176` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Claims Breakdown */}
                      <div className="flex items-center gap-3 px-4 border-l border-border/30">
                        <div className="text-center">
                          <span className="text-sm font-mono text-success">{company.claims.verified}</span>
                          <span className="block text-[10px] text-muted-foreground">Verified</span>
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-mono text-warning">{company.claims.review}</span>
                          <span className="block text-[10px] text-muted-foreground">Review</span>
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-mono text-danger">{company.claims.gap}</span>
                          <span className="block text-[10px] text-muted-foreground">Gaps</span>
                        </div>
                      </div>

                      <Link to="/claims">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Geographic Distribution */}
          <div className="col-span-4">
            <motion.div 
              className="glass-panel h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="px-4 py-3 border-b border-border/30">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-primary" />
                  Geographic Distribution
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {regionData.map((region, i) => (
                  <motion.div
                    key={region.region}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-foreground">{region.region}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">{region.companies} cos</span>
                        <span className={cn(
                          "font-mono",
                          region.avgScore >= 70 ? "text-success" :
                          region.avgScore >= 50 ? "text-warning" :
                          "text-danger"
                        )}>
                          {region.avgScore}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          region.avgScore >= 70 ? "bg-success" :
                          region.avgScore >= 50 ? "bg-warning" :
                          "bg-danger"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${region.avgScore}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Risk Distribution */}
              <div className="p-4 border-t border-border/30">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Risk Distribution</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                    <motion.div 
                      className="bg-success h-full"
                      initial={{ width: 0 }}
                      animate={{ width: '40%' }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                    <motion.div 
                      className="bg-warning h-full"
                      initial={{ width: 0 }}
                      animate={{ width: '35%' }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    />
                    <motion.div 
                      className="bg-danger h-full"
                      initial={{ width: 0 }}
                      animate={{ width: '25%' }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-success">Low 40%</span>
                  <span className="text-warning">Medium 35%</span>
                  <span className="text-danger">High 25%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PortfolioOverview;
