import React, { useEffect, useMemo, useRef, useState } from "react";
import heic2any from "heic2any";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// SEO helpers
const setMetaTag = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const setCanonical = (href: string) => {
  let link = document.querySelector("link[rel=\"canonical\"]") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
};

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

export default function JobUploads() {
  // SEO
  useEffect(() => {
    document.title = "Job Uploads | ARW Roofing";
    setMetaTag("description", "Bulk upload and organize job photos with HEIC conversion and resizing.");
    setCanonical(window.location.origin + "/job-uploads");
  }, []);

  const { toast } = useToast();
  const sheetApiUrl =
    "https://script.google.com/macros/s/AKfycbxAeT0tXnBGwhw7NaoAvgdhUHz412L4ESPi62gtx0SUruZnEdUOn6nUi6APrOWxlrlekg/exec";
  const webhookUrl = "https://n8n.wayvvault.cc/webhook/image-uploader";
  const BATCH_SIZE = 20;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [addressQuery, setAddressQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobId, setJobId] = useState("");
  const [description, setDescription] = useState("");

  const [folderName, setFolderName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(sheetApiUrl);
        if (!res.ok) throw new Error("Failed to load jobs");
        const data: Job[] = await res.json();
        setJobs(data);
      } catch (err: any) {
        toast({ title: "Error", description: err.message ?? "Failed to load jobs", variant: "destructive" });
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, [toast]);

  const jobOptions = useMemo(() => {
    return jobs.map((j) => {
      const addr = [j.worksLocationSuburb, j.worksLocationState, j.worksLocationPostcode].filter(Boolean).join(", ");
      return {
        key: `${j.jobId}|${j.number}`,
        label: `${j.description} — ${addr} (Job ${j.number})`,
        addr,
        job: j,
      };
    });
  }, [jobs]);

  useEffect(() => {
    const match = jobOptions.find((o) => o.label === addressQuery);
    if (match) {
      setSelectedJob(match.job);
      setJobId(match.job.jobId);
      setDescription(match.job.description);
    } else {
      setSelectedJob(null);
    }
  }, [addressQuery, jobOptions]);

  async function resizeImage(file: File, maxDim = 3000): Promise<File> {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img as HTMLImageElement & { width: number; height: number };
        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob as Blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), { type: "image/jpeg" }));
        }, "image/jpeg", 0.85);
      };
      reader.readAsDataURL(file);
    });
  }

  async function addFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const processed: File[] = [];

    for (const f of arr) {
      let fileToAdd = f;
      const isHeic = f.type === "image/heic" || f.type === "image/heif" || /\.hei[c|f]$/i.test(f.name);
      if (isHeic) {
        try {
          const blob = (await heic2any({ blob: f, toType: "image/jpeg", quality: 0.9 })) as Blob;
          fileToAdd = new File([blob], f.name.replace(/\.(heic|heif)$/i, ".jpg"), { type: "image/jpeg" });
        } catch {
          // if conversion fails, keep original
        }
      }
      if (fileToAdd.type.startsWith("image/")) {
        fileToAdd = await resizeImage(fileToAdd);
        processed.push(fileToAdd);
      }
    }

    if (processed.length !== arr.length) {
      toast({ title: "Skipped non-image files", description: "Only images are accepted.", variant: "destructive" });
    }

    const merged = [...images, ...processed].slice(0, 100);
    setImages(merged);
  }

  const onInputFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await addFiles(e.target.files);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      await addFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImageAt = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  async function handleUpload() {
    if (images.length === 0) {
      toast({ title: "No images", description: "Add some images to upload.", variant: "destructive" });
      return;
    }
    if (!addressQuery.trim()) {
      toast({ title: "Address required", description: "Type an address or pick from suggestions.", variant: "destructive" });
      return;
    }

    setUploading(true);
    setUploadedCount(0);

    const attendanceDate = new Date().toISOString().split("T")[0];
    const attendanceTime = new Date().toTimeString().split(" ")[0];

    try {
      for (let start = 0; start < images.length; start += BATCH_SIZE) {
        const batch = images.slice(start, start + BATCH_SIZE);
        const fd = new FormData();

        fd.append("jobId", jobId || "");
        fd.append("job", description || "");
        fd.append("number", selectedJob?.number || "");
        fd.append("clientName", selectedJob?.clientName || "");
        fd.append("locationAddress", addressQuery);
        fd.append("folderName", folderName);
        fd.append("category", category);
        if (notes.trim()) fd.append("notes", notes.trim());
        fd.append("attendanceDate", attendanceDate);
        fd.append("attendanceTime", attendanceTime);
        fd.append("dateSubmitted", attendanceDate);

        for (const file of batch) {
          fd.append("images", file, file.name);
        }

        const res = await fetch(webhookUrl, { method: "POST", body: fd });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Upload failed (${res.status}): ${text}`);
        }

        setUploadedCount((prev) => prev + batch.length);
      }

      toast({ title: "Upload complete", description: `${images.length} image(s) uploaded successfully.` });
      setImages([]);
    } catch (err: any) {
      toast({ title: "Error", description: err.message ?? "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  const progressPct = images.length ? Math.round((uploadedCount / images.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Roof Photos — Bulk Uploader</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address (type to auto-complete)</Label>
                <Input
                  id="address"
                  list="job-suggestions"
                  placeholder={loadingJobs ? "Loading jobs…" : "Start typing address or description"}
                  value={addressQuery}
                  onChange={(e) => setAddressQuery(e.target.value)}
                  disabled={loadingJobs}
                />
                <datalist id="job-suggestions">
                  {jobOptions.map((o) => (
                    <option key={o.key} value={o.label} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label>Job ID</Label>
                <Input value={jobId} onChange={(e) => setJobId(e.target.value)} placeholder="e.g. 123e456…" />
              </div>
            </div>
            {/* Desc & Job No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Job description" />
              </div>
              <div>
                <Label>Job Number</Label>
                <Input value={selectedJob?.number || ""} readOnly className="bg-muted" />
              </div>
            </div>
            {/* Folder & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Folder Name</Label>
                <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="e.g. Make Safe 2025-08-11" />
              </div>
              <div>
                <Label>Category</Label>
                <Input list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Before / After / Scope" />
                <datalist id="category-options">
                  <option value="Make Safe" />
                  <option value="Scope" />
                  <option value="Before" />
                  <option value="After" />
                  <option value="Invoices" />
                  <option value="Certificates" />
                  <option value="Other" />
                </datalist>
              </div>
            </div>
            {/* Notes */}
            <div>
              <Label>Notes (optional)</Label>
              <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Context for these photos" />
            </div>
            {/* Dropzone */}
            <div
              ref={dropRef}
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-muted/30 transition"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <p className="font-medium">Drag & drop images here, or click to browse</p>
              <p className="text-sm text-muted-foreground">Up to 100 images. HEIC auto-converted, large files resized.</p>
              <input id="file-input" type="file" accept="image/*" multiple className="hidden" onChange={onInputFiles} />
            </div>
            {/* Previews */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{images.length} image(s) ready</p>
                  {uploading && (
                    <p className="text-sm">Uploading {uploadedCount}/{images.length} — {progressPct}%</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={URL.createObjectURL(img)} alt={img.name} className="w-full h-32 object-cover rounded-xl border" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => { e.stopPropagation(); removeImageAt(i); }}
                      >
                        Remove
                      </button>
                      <div className="mt-1 text-[10px] truncate" title={img.name}>{img.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="button" className="w-full sm:w-auto" onClick={handleUpload} disabled={uploading || images.length === 0 || !addressQuery.trim()}>
                {uploading ? `Uploading… (${progressPct}%)` : "Upload Photos"}
              </Button>
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setImages([])} disabled={uploading || images.length === 0}>
                Clear Images
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
