import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, File, X } from 'lucide-react';

const AdminJobUploads = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [jobNumber, setJobNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      // Reset form
      setFiles([]);
      setJobNumber('');
      setClientName('');
      setDescription('');
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Job Uploads Manager</h2>
          <p className="text-slate-600">Upload and manage job-related files and documentation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobNumber">Job Number</Label>
                  <Input
                    id="jobNumber"
                    value={jobNumber}
                    onChange={(e) => setJobNumber(e.target.value)}
                    placeholder="Enter job number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the uploads..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>File Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-slate-600 font-medium">Click to upload files</span>
                  <span className="text-slate-500 text-sm block mt-1">or drag and drop</span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900">Selected Files:</h4>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-slate-500" />
                        <span className="text-sm text-slate-700">{file.name}</span>
                        <span className="text-xs text-slate-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminJobUploads;
