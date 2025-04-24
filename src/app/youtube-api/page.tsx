"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/components/ProgressBar';
import * as models from '@/models';
import ResultsList from '@/components/ResultsList';
import VideoInput from '@/components/VideoInput';


/**
 * FetchedResultsPage 
 * Renders the page for fetching YouTube video statistics using the YouTube Data API.
 * It allows users to input video IDs or URLs, query the data, and download the results as a CSV file.
 */
export default function YouTubeApiPage() {
  
  const [videoIds, setVideoIds] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<models.JobStatus | null>(null);
  const [results, setResults] = useState<models.Results>({ videos: [], errors: [] });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (jobId && jobStatus?.status !== 'completed' && jobStatus?.status !== 'failed') {
      intervalId = setInterval(async () => {
        const response = await fetch(`/api/external/status/${jobId}`);
        const status = await response.json();
        setJobStatus(status);

        if (status.status === 'completed') {
          const resultsResponse = await fetch(`/api/external/results/${jobId}`);
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
      const response = await fetch('/api/external/fetch', {
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
            const value = row[header as keyof models.VideoStatistics];
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
    <div className="flex h-screen bg-gray-100">
      {/* Side Menu */}
      <div className={`bg-gray-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 transition-all duration-300 ease-in-out h-screen`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>YouTube Tools</h2>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-1 rounded-md hover:bg-gray-700"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        
        <nav className="mt-5">
          <Link 
            href="/"
            className="flex items-center px-4 py-3 hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span className="ml-3">Home</span>}
          </Link>
          
          <Link 
            href="/youtube-scraper"
            className="flex items-center px-4 py-3 hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {sidebarOpen && <span className="ml-3">Video Scraper</span>}
          </Link>
          
          <Link 
            href="/youtube-api"
            className="flex items-center px-4 py-3 bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {sidebarOpen && <span className="ml-3">API Explorer</span>}
          </Link>

          <div className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {sidebarOpen && <span className="ml-3">Channel Analytics</span>}
          </div>
                    
          <div className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {sidebarOpen && <span className="ml-3">Comment Analyzer</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">YouTube API Explorer</h1>
          
          <VideoInput videoIds={videoIds} onChange={setVideoIds} />

          <div className="flex space-x-2 mb-4">
            <button 
              onClick={handleScrape}
              disabled={jobStatus?.status === 'running'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {jobStatus?.status === 'running' ? 'Fetching...' : 'Fetch Videos'}
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
            <ResultsList results={results} />
          )}
        </div>
      </div>
    </div>
  );
}