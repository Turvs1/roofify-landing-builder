import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Job {
  description: string;
  number: string;
  clientName: string;
}

const RoofReport = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const { toast } = useToast();

  const sheetApiUrl = "https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec";
  const webhookUrl = "https://n8n.wayvvault.cc/webhook/form-builder";

  // Load dropdown options from Google Sheets
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch(sheetApiUrl);
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Error loading jobs:', err);
        toast({
          title: "Error",
          description: "Failed to load jobs from the database",
          variant: "destructive",
        });
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadJobs();
  }, [toast]);

  const handleJobChange = (description: string) => {
    setSelectedDescription(description);
    const matchedJob = jobs.find(job => job.description === description);
    setSelectedJob(matchedJob || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob || !notes.trim()) {
      toast({
        title: "Error",
        description: "Please select a job and provide notes",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: selectedDescription, notes })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Report submitted successfully",
        });
        setSelectedDescription('');
        setSelectedJob(null);
        setNotes('');
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Submit Job Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Select value={selectedDescription} onValueChange={handleJobChange} disabled={isLoadingJobs}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingJobs ? "Loading jobs..." : "Select a description..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job, index) => (
                      <SelectItem key={index} value={job.description}>
                        {job.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Job Number</Label>
                <Input
                  id="number"
                  value={selectedJob?.number || ''}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={selectedJob?.clientName || ''}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe work completed, issues, etc."
                  rows={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || isLoadingJobs}
              >
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoofReport;