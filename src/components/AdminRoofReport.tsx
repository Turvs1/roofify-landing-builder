import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Job {
  description: string;
  number: string;
  clientName: string;
  worksLocationSuburb: string;
  worksLocationState: string;
  worksLocationPostcode: string;
  buildingType: string;
  jobId: string;
}

const AdminRoofReport = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // New: capture the Sheet's Job ID
  const [jobId, setJobId] = useState('');

  // Existing
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);

  // New fields
  const [weather, setWeather] = useState('');
  const [lightConditions, setLightConditions] = useState('');
  // Composed address for weather lookup
  const [locationAddress, setLocationAddress] = useState('');
  const [isPowerIsolated, setIsPowerIsolated] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [ageOfProperty, setAgeOfProperty] = useState<number | ''>('');
  const [propertyCondition, setPropertyCondition] = useState('');
  const [constructionType, setConstructionType] = useState('');
  const [roofType, setRoofType] = useState('');
  const [roofCondition, setRoofCondition] = useState('');
  const [roofAge, setRoofAge] = useState<number | ''>('');
  const [roofPitch, setRoofPitch] = useState('');
  const [ceilingInspection, setCeilingInspection] = useState('');
  const [trussSpacing, setTrussSpacing] = useState('');
  const [battensType, setBattensType] = useState('');
  const [membraneType, setMembraneType] = useState('');
  const [complyStandards, setComplyStandards] = useState('');
  const [complyManufacturers, setComplyManufacturers] = useState('');
  const [maintenanceIssues, setMaintenanceIssues] = useState('');
  const [informedInsured, setInformedInsured] = useState('');
  const [roofDamagePercent, setRoofDamagePercent] = useState<number | ''>('');
  const [visualInspectionDamage, setVisualInspectionDamage] = useState('');
  const [damageRelatedEvent, setDamageRelatedEvent] = useState('');
  const [gutterGuard, setGutterGuard] = useState('');
  const [spreaderDownpipes, setSpreaderDownpipes] = useState('');
  const [flashingsCorrect, setFlashingsCorrect] = useState('');
  const [guttersClean, setGuttersClean] = useState('');
  const [windLift, setWindLift] = useState('');
  const [windLiftCause, setWindLiftCause] = useState('');
  const [materialLifespanDecreased, setMaterialLifespanDecreased] = useState('');
  const [fullReplacement, setFullReplacement] = useState('');
  const [structuralIntegrity, setStructuralIntegrity] = useState('');
  const [internalDamageDesc, setInternalDamageDesc] = useState('');
  const [ceilingWallCondition, setCeilingWallCondition] = useState('');
  const [internalMaintenanceNotes, setInternalMaintenanceNotes] = useState('');
  const [internalMaintenanceSummary, setInternalMaintenanceSummary] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [additionalRepairs, setAdditionalRepairs] = useState('');
  const [reporterName, setReporterName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const sheetApiUrl =
    'https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec';
  const webhookUrl = 'https://n8n.wayvvault.cc/webhook/form-builder';

  // Load jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(sheetApiUrl);
        const data = await res.json();
        setJobs(data);
        setIsLoadingJobs(false);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setIsLoadingJobs(false);
      }
    }
    loadJobs();
  }, []);

  // Rest of your existing RoofReport component logic here...
  // I'll add a simplified version for now

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Roof Report Generator</h2>
          <p className="text-slate-600">Generate comprehensive roof inspection reports</p>
        </div>

        {/* Job Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Job</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingJobs ? (
              <p>Loading jobs...</p>
            ) : (
              <Select onValueChange={setSelectedDescription}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job description" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job, index) => (
                    <SelectItem key={index} value={job.description}>
                      {job.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weather">Weather Conditions</Label>
                <Input
                  id="weather"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  placeholder="e.g., Sunny, Cloudy, Rainy"
                />
              </div>
              <div>
                <Label htmlFor="lightConditions">Light Conditions</Label>
                <Input
                  id="lightConditions"
                  value={lightConditions}
                  onChange={(e) => setLightConditions(e.target.value)}
                  placeholder="e.g., Good, Poor, Artificial"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes or observations..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="reporterName">Reporter Name</Label>
              <Input
                id="reporterName"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            disabled={isLoading}
          >
            {isLoading ? 'Generating Report...' : 'Generate Roof Report'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRoofReport;
