"use client"

import { useState, useEffect } from 'react';
import { ProgressBar } from '@/components/ProgressBar';

interface VideoStatistics {
  video_id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  published_at: string;
  upload_date: string;
  channel_name: string;
  url: string;
}

interface ScrapingProgress {
  completed: number;
  total: number;
  current_video: string;
}

interface JobStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: ScrapingProgress;
  results: VideoStatistics[] | null;
  error: string | null;
}

interface Results {
  videos: VideoStatistics[];
  errors: VideoStatistics[];
  status?: 'running'|'completed'|'failed';
}

export default function Home() {
  const [videoIds, setVideoIds] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [results, setResults] = useState<Results>({ videos: [], errors: [] });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (jobId && jobStatus?.status !== 'completed' && jobStatus?.status !== 'failed') {
      intervalId = setInterval(async () => {
        const response = await fetch(`http://localhost:8000/status/${jobId}`);
        const status = await response.json();
        setJobStatus(status);

        if (status.status === 'completed') {
          const resultsResponse = await fetch(`http://localhost:8000/results/${jobId}`);
          const { results } = await resultsResponse.json();
          setResults(results);
          clearInterval(intervalId);
        } else if (status.status === 'failed') {
          clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, jobStatus?.status]);

  const handleScrape = async () => {
    const ids = videoIds
      .split(/[\n,]/)
      .map(id => {
        const urlPattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = id.match(urlPattern);
        return match ? match[1] : id.trim();
      })
      .filter(id => id.length === 11);

    if (ids.length === 0) {
      alert('Please enter valid YouTube video IDs or URLs');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_ids: ids }),
      });

      const { job_id } = await response.json();
      setJobId(job_id);
      setJobStatus({
        status: 'pending',
        progress: { completed: 0, total: ids.length, current_video: '' },
        results: null,
        error: null
      });
    } catch (error) {
      console.error('Failed to start scraping:', error);
      alert('Failed to start scraping. Please try again.');
    }
  };

  const handleDownloadCSV = () => {
    if (!results?.videos?.length) return;

    const headers = Object.keys(results?.videos?.[0]);
    const csvRows = [
      headers.join(','),
      ...results?.videos?.map(row =>
        headers
          .map(header => {
            const value = row[header as keyof VideoStatistics];
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'youtube_stats.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progressPercent = jobStatus?.progress 
    ? jobStatus.progress.completed / jobStatus.progress.total 
    : 0;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">YouTube Video Statistics Scraper</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter YouTube video IDs or URLs (one per line or comma-separated)
        </label>
        <textarea 
          value={videoIds}
          onChange={(e) => setVideoIds(e.target.value)}
          placeholder="Example:
            uuo2KqoJxsc
            https://www.youtube.com/watch?v=UJfX-ZrDZmU
            youtu.be/0_jC8Lg-oxY"
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <div className="flex space-x-2 mb-4">
        <button 
          onClick={handleScrape}
          disabled={jobStatus?.status === 'running'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {jobStatus?.status === 'running' ? 'Scraping...' : 'Scrape Videos'}
        </button>

        {results?.videos?.length > 0 && (
          <button 
            onClick={handleDownloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download CSV
          </button>
        )}
      </div>

      {jobStatus?.status === 'running' && (
        <div className="mb-4">
          <ProgressBar 
            progress={progressPercent}
            currentVideo={jobStatus.progress.current_video}
          />
        </div>
      )}

      {jobStatus?.error && (
        <div className="text-red-500 mb-4">
          Error: {jobStatus.error}
        </div>
      )}

      {results?.videos?.length > 0 && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Video ID</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Views</th>
                <th className="border p-2">Likes</th>
                <th className="border p-2">Comments</th>
                <th className="border p-2">Upload Date</th>
                <th className="border p-2">Channel</th>
              </tr>
            </thead>
            <tbody>
              {results?.videos?.map((video) => (
                <tr key={video.video_id}>
                  <td className="border p-2">{video.video_id}</td>
                  <td className="border p-2">{video.title}</td>
                  <td className="border p-2">{video.views?.toLocaleString() || '0'}</td>
                  <td className="border p-2">{video.likes?.toLocaleString() || '0'}</td>
                  <td className="border p-2">{video.comments?.toLocaleString() || ''}</td>
                  <td className="border p-2">{video.published_at}</td>
                  <td className="border p-2">{video.channel_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
