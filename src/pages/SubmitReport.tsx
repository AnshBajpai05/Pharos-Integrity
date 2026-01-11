import { motion } from 'framer-motion';
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
  Loader2
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

const claimTypes = [
  'Carbon Emissions Reduction',
  'Renewable Energy Transition',
  'Water Conservation',
  'Waste Management',
  'Biodiversity Protection',
  'Supply Chain Sustainability',
  'Social Impact',
  'Governance Improvement',
  'Net Zero Commitment',
  'Circular Economy'
];

const SubmitReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    claimType: '',
    claimText: '',
    targetDate: '',
    sourceUrl: '',
    location: '',
    additionalNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        companyName: '',
        sector: '',
        claimType: '',
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
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
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
                Add an ESG claim for automated integrity verification
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="claimType">Claim Category *</Label>
                <Select
                  value={formData.claimType}
                  onValueChange={(value) => handleInputChange('claimType', value)}
                  required
                >
                  <SelectTrigger className="bg-muted/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    {claimTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
                placeholder="Any additional context, supporting information, or specific areas to investigate..."
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={3}
                className="bg-muted/50 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Document Upload Placeholder */}
            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  PDF, DOCX, PNG, JPG up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
          >
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Verification Process</p>
              <p>
                Once submitted, PHAROS will automatically analyze this claim using satellite imagery, 
                sensor data, and public records. You'll receive notifications as the verification progresses.
              </p>
            </div>
          </motion.div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                companyName: '',
                sector: '',
                claimType: '',
                claimText: '',
                targetDate: '',
                sourceUrl: '',
                location: '',
                additionalNotes: ''
              })}
              className="border-border/50"
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || submitted}
              className={cn(
                "btn-neon min-w-[160px]",
                (isSubmitting || submitted) && "opacity-70"
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
      </div>
    </AppLayout>
  );
};

export default SubmitReport;
