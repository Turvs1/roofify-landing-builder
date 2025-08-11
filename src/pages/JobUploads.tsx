import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const setMetaTag = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const setCanonical = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
};

const JobUploads: React.FC = () => {
  useEffect(() => {
    document.title = 'Job Uploads | ARW Roofing';
    setMetaTag('description', 'Job Uploads page to manage and view your uploaded roofing job assets.');
    setCanonical(window.location.origin + '/job-uploads');
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <main className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Uploads</h1>
          <p className="text-muted-foreground mt-2">Manage and review files related to your jobs. This area will evolve to support uploads and organization.</p>
        </header>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Coming soon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">This page is ready and routed. Tell me what you want here (simple uploader, list of files per job, etc.) and I will implement it.</p>
              <div className="flex gap-3">
                <Button asChild variant="secondary">
                  <Link to="/roof-report">Go to Roof Report</Link>
                </Button>
                <Button asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default JobUploads;
