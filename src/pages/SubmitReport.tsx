import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { 
  FilePlus, 
  Upload, 
  Building2, 
  MapPin, 
  Calendar,
  FileText,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldAlert,
  Target,
  Eye,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const sectors = [
  'Energy',
  'Materials',
  'Industrials',
  'Consumer Discretionary',
  'Consumer Staples',
  'Healthcare',
  'Financials',
  'Technology',
  'Telecommunications',
  'Utilities',
  'Real Estate'
];

interface ClaimAnalysis {
  claimType: string;
  specificityScore: number;
  verifiabilityScore: number;
  keyMetrics: string[];
  redFlags: string[];
  verificationApproach: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
}

const SubmitReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    claimText: '',
    targetDate: '',
    sourceUrl: '',
    location: '',
    additionalNotes: ''
  });

  const analyzeClaimWithAI = async () => {
    if (!formData.claimText.trim()) {
      toast({
        title: "Missing claim text",
        description: "Please enter a claim statement to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-claim', {
        body: {
          claimText: formData.claimText,
          companyName: formData.companyName,
          sector: formData.sector
        }
      });

      if (error) throw error;

      if (data.analysis) {
        setAnalysis(data.analysis);
        toast({
          title: "Claim analyzed",
          description: "AI has detected and categorized your claim.",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Could not analyze the claim.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!analysis) {
      toast({
        title: "Analyze first",
        description: "Please analyze the claim before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission (would save to database in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    toast({
      title: "Report submitted",
      description: "Your claim has been queued for verification.",
    });
    
    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false);
      setAnalysis(null);
      setFormData({
        companyName: '',
        sector: '',
        claimText: '',
        targetDate: '',
        sourceUrl: '',
        location: '',
        additionalNotes: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear analysis when claim text changes
    if (field === 'claimText') {
      setAnalysis(null);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-success border-success/30 bg-success/10';
      case 'Medium': return 'text-warning border-warning/30 bg-warning/10';
      case 'High': return 'text-danger border-danger/30 bg-danger/10';
      default: return 'text-muted-foreground border-border bg-muted/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-success';
    if (score >= 4) return 'text-warning';
    return 'text-danger';
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FilePlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Submit New Report</h1>
              <p className="text-sm text-muted-foreground">
                Add an ESG claim — AI will detect and categorize it automatically
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 border-success/30 bg-success/5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/20">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-medium text-success">Report Submitted Successfully</h3>
                  <p className="text-sm text-muted-foreground">
                    Your claim has been queued for verification analysis
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >
            {/* Company Information */}
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Company Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Acme Corporation"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                    className="bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sector">Industry Sector *</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => handleInputChange('sector', value)}
                    required
                  >
                    <SelectTrigger className="bg-muted/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Geographic Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., United States, Europe, Global"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Claim Details */}
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Claim Details
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target/Commitment Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => handleInputChange('targetDate', e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="claimText">Claim Statement *</Label>
                <Textarea
                  id="claimText"
                  placeholder="Enter the exact ESG claim or commitment made by the company..."
                  value={formData.claimText}
                  onChange={(e) => handleInputChange('claimText', e.target.value)}
                  required
                  rows={4}
                  className="bg-muted/50 border-border/50 focus:border-primary resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Provide the verbatim text of the claim as stated in official documents
                </p>
              </div>

              {/* Analyze Button */}
              <Button
                type="button"
                onClick={analyzeClaimWithAI}
                disabled={isAnalyzing || !formData.claimText.trim()}
                className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 text-primary-foreground"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Detect & Analyze Claim
                  </>
                )}
              </Button>
            </div>

            {/* Source Information */}
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Source Information
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="sourceUrl">Source URL</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  placeholder="https://company.com/sustainability-report.pdf"
                  value={formData.sourceUrl}
                  onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
                  className="bg-muted/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional context or areas to investigate..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={2}
                  className="bg-muted/50 border-border/50 focus:border-primary resize-none"
                />
              </div>

              {/* Document Upload Placeholder */}
              <div className="space-y-2">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    PDF, DOCX up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    companyName: '',
                    sector: '',
                    claimText: '',
                    targetDate: '',
                    sourceUrl: '',
                    location: '',
                    additionalNotes: ''
                  });
                  setAnalysis(null);
                }}
                className="border-border/50"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || submitted || !analysis}
                className={cn(
                  "btn-neon min-w-[160px]",
                  (isSubmitting || submitted || !analysis) && "opacity-70"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submitted
                  </>
                ) : (
                  <>
                    <FilePlus className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </motion.form>

          {/* Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass-panel p-4 sticky top-6">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Claim Analysis
              </h3>

              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                      <Sparkles className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">Analyzing claim...</p>
                  </motion.div>
                ) : analysis ? (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Risk Level Badge */}
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
                      getRiskColor(analysis.riskLevel)
                    )}>
                      <ShieldAlert className="w-4 h-4" />
                      {analysis.riskLevel} Risk
                    </div>

                    {/* Claim Type */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Detected Type</p>
                      <p className="text-sm font-medium text-foreground">{analysis.claimType}</p>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Target className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Specificity</p>
                        </div>
                        <p className={cn("text-xl font-bold", getScoreColor(analysis.specificityScore))}>
                          {analysis.specificityScore}/10
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Verifiability</p>
                        </div>
                        <p className={cn("text-xl font-bold", getScoreColor(analysis.verifiabilityScore))}>
                          {analysis.verifiabilityScore}/10
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Summary</p>
                      <p className="text-sm text-foreground">{analysis.summary}</p>
                    </div>

                    {/* Key Metrics */}
                    {analysis.keyMetrics.length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <TrendingUp className="w-3 h-3 text-primary" />
                          <p className="text-xs text-muted-foreground">Key Metrics</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.keyMetrics.map((metric, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Red Flags */}
                    {analysis.redFlags.length > 0 && (
                      <div className="p-3 rounded-lg bg-danger/5 border border-danger/20">
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="w-3 h-3 text-danger" />
                          <p className="text-xs text-danger">Red Flags</p>
                        </div>
                        <ul className="space-y-1">
                          {analysis.redFlags.map((flag, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-danger mt-0.5">•</span>
                              {flag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Verification Approach */}
                    {analysis.verificationApproach.length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Eye className="w-3 h-3 text-primary" />
                          <p className="text-xs text-muted-foreground">Verification Methods</p>
                        </div>
                        <ul className="space-y-1">
                          {analysis.verificationApproach.map((approach, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">•</span>
                              {approach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter a claim and click "Detect & Analyze" to see AI insights
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SubmitReport;
