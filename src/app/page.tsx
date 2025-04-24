"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">YouTube Data Tools</h1>
        <p className="text-xl text-gray-600">
          Collection of tools for scraping and analyzing YouTube data
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Video Statistics Scraper</h2>
          <p className="text-gray-600 mb-4">
            Extract view counts, likes, comments, and more from YouTube videos using their IDs.
          </p>
          <Link 
            href="/youtube-scraper" 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Launch Tool
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">YouTube API Explorer</h2>
          <p className="text-gray-600 mb-4">
            Explore the YouTube Data API and fetch video details, playlists, and more.
          </p>
          <Link 
            href="/youtube-api" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Launch Tool
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow opacity-50">
          <h2 className="text-2xl font-bold mb-2">Channel Analytics</h2>
          <p className="text-gray-600 mb-4">
            Coming soon: Analyze YouTube channels for subscriber growth, content patterns and more.
          </p>
          <button 
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  )
}