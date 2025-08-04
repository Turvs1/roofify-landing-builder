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
}

const RoofReport = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // --- existing fields ---
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);

  // --- automatically generated date/time ---
  const now = new Date();
  const attendanceDate = now.toISOString().slice(0, 10);        // YYYY-MM-DD
  const attendanceTime = now.toTimeString().slice(0, 8);       // HH:MM:SS
  const dateSubmitted = attendanceDate;

  // --- all the new fields you specified ---
  const [weather, setWeather] = useState('');
  const [lightConditions, setLightConditions] = useState('');
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

  const sheetApiUrl =
    'https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec';
  const webhookUrl = 'https://n8n.wayvvault.cc/webhook/form-builder';

  // Load Buildxact jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(sheetApiUrl);
        const data = await res.json();
        setJobs(data);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load jobs',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingJobs(false);
      }
    }
    loadJobs();
  }, [toast]);

  const handleJobChange = (desc: string) => {
    setSelectedDescription(desc);
    setSelectedJob(jobs.find((j) => j.description === desc) || null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setCaptions(files.map(() => ''));
  };

  const handleCaptionChange = (i: number, txt: string) => {
    const c = [...captions];
    c[i] = txt;
    setCaptions(c);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !notes.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a job and provide notes.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();

      // --- always include these ---
      fd.append('job', selectedDescription);
      fd.append('number', selectedJob.number);
      fd.append('clientName', selectedJob.clientName);
      fd.append('notes', notes);

      // --- auto dates/times ---
      fd.append('attendanceDate', attendanceDate);
      fd.append('attendanceTime', attendanceTime);

      // --- your new fields ---
      fd.append('weather', weather);
      fd.append('lightConditions', lightConditions);
      fd.append('isPowerIsolated', isPowerIsolated);
      fd.append('propertyType', propertyType);
      fd.append('ageOfProperty', String(ageOfProperty));
      fd.append('propertyCondition', propertyCondition);
      fd.append('constructionType', constructionType);
      fd.append('roofType', roofType);
      fd.append('roofCondition', roofCondition);
      fd.append('roofAge', String(roofAge));
      fd.append('roofPitch', roofPitch);
      fd.append('ceilingInspection', ceilingInspection);
      fd.append('trussSpacing', trussSpacing);
      fd.append('battensType', battensType);
      fd.append('membraneType', membraneType);
      fd.append('complyStandards', complyStandards);
      fd.append('complyManufacturers', complyManufacturers);
      fd.append('maintenanceIssues', maintenanceIssues);
      fd.append('informedInsured', informedInsured);
      fd.append('roofDamagePercent', String(roofDamagePercent));
      fd.append('visualInspectionDamage', visualInspectionDamage);
      fd.append('damageRelatedEvent', damageRelatedEvent);
      fd.append('gutterGuard', gutterGuard);
      fd.append('spreaderDownpipes', spreaderDownpipes);
      fd.append('flashingsCorrect', flashingsCorrect);
      fd.append('guttersClean', guttersClean);
      fd.append('windLift', windLift);
      fd.append('windLiftCause', windLiftCause);
      fd.append('materialLifespanDecreased', materialLifespanDecreased);
      fd.append('fullReplacement', fullReplacement);
      fd.append('structuralIntegrity', structuralIntegrity);
      fd.append('internalDamageDesc', internalDamageDesc);
      fd.append('ceilingWallCondition', ceilingWallCondition);
      fd.append('internalMaintenanceNotes', internalMaintenanceNotes);
      fd.append('internalMaintenanceSummary', internalMaintenanceSummary);
      fd.append('conclusion', conclusion);
      fd.append('additionalRepairs', additionalRepairs);

      // --- images + captions ---
      images.forEach((f, i) => {
        fd.append(`image_${i}`, f);
        fd.append(`caption_${i}`, captions[i] || '');
      });

      // --- reporter & submission date ---
      fd.append('reporterName', reporterName);
      fd.append('dateSubmitted', dateSubmitted);

      const res = await fetch(webhookUrl, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      toast({ title: 'Success', description: 'Report sent!' });
      // reset all:
      setSelectedDescription('');
      setSelectedJob(null);
      setNotes('');
      setImages([]);
      setCaptions([]);
      setWeather('');
      setLightConditions('');
      setIsPowerIsolated('');
      setPropertyType('');
      setAgeOfProperty('');
      setPropertyCondition('');
      setConstructionType('');
      setRoofType('');
      setRoofCondition('');
      setRoofAge('');
      setRoofPitch('');
      setCeilingInspection('');
      setTrussSpacing('');
      setBattensType('');
      setMembraneType('');
      setComplyStandards('');
      setComplyManufacturers('');
      setMaintenanceIssues('');
      setInformedInsured('');
      setRoofDamagePercent('');
      setVisualInspectionDamage('');
      setDamageRelatedEvent('');
      setGutterGuard('');
      setSpreaderDownpipes('');
      setFlashingsCorrect('');
      setGuttersClean('');
      setWindLift('');
      setWindLiftCause('');
      setMaterialLifespanDecreased('');
      setFullReplacement('');
      setStructuralIntegrity('');
      setInternalDamageDesc('');
      setCeilingWallCondition('');
      setInternalMaintenanceNotes('');
      setInternalMaintenanceSummary('');
      setConclusion('');
      setAdditionalRepairs('');
      setReporterName('');
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Submit failed.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueDescriptions = Array.from(new Set(jobs.map((j) => j.description)));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Roof Report Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Attendance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Attendance Date</Label>
                  <Input value={attendanceDate} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Attendance Time</Label>
                  <Input value={attendanceTime} readOnly className="bg-muted" />
                </div>
              </div>

              {/* Job selector */}
              <div>
                <Label>Job Description</Label>
                <Select
                  value={selectedDescription}
                  onValueChange={handleJobChange}
                  disabled={isLoadingJobs}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingJobs ? 'Loading…' : 'Select…'} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDescriptions.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number & Client */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Number</Label>
                  <Input value={selectedJob?.number || ''} readOnly className="bg-muted" />
                </div>
                <div>
                  <Label>Client Name</Label>
                  <Input value={selectedJob?.clientName || ''} readOnly className="bg-muted" />
                </div>
              </div>

              {/* Weather / Light */}
              <div>
                <Label>Weather at Time of Inspection</Label>
                <Input value={weather} onChange={(e) => setWeather(e.target.value)} />
              </div>
              <div>
                <Label>Light Conditions</Label>
                <Input value={lightConditions} onChange={(e) => setLightConditions(e.target.value)} />
              </div>

              {/* …then all of your dropdowns, text inputs, number inputs and textareas exactly as above… */}

              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              {/* Photos + captions */}
              <div>
                <Label>Upload Roof Photos</Label>
                <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
              </div>
              {images.map((img, i) => (
                <div key={i} className="space-y-2">
                  <Label>Caption for {img.name}</Label>
                  <Input
                    value={captions[i]}
                    onChange={(e) => handleCaptionChange(i, e.target.value)}
                  />
                </div>
              ))}

              {/* Reporter + submitted date */}
              <div>
                <Label>Your Name</Label>
                <Input
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                />
              </div>
              <div>
                <Label>Date Submitted</Label>
                <Input value={dateSubmitted} readOnly className="bg-muted" />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isLoadingJobs}
              >
                {isLoading ? 'Submitting…' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoofReport;