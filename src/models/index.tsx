export interface VideoStatistics {
  video_id: string;
  title: string;
  view_count: number;
  likes: number;
  comments: number;
  published_at: string;
  upload_date: string;
  channel_name: string;
  channel_id: string;
  url: string;
  duration: string;
  language_name: string;
}

export interface ScrapingProgress {
  completed: number;
  total: number;
  current_video: string;
}

export interface JobStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: ScrapingProgress;
  results: VideoStatistics[] | null;
  error: string | null;
}

export interface Results {
  videos: VideoStatistics[];
  errors: VideoStatistics[];
  status?: 'running' | 'completed' | 'failed';
}