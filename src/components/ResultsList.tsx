import { Results } from '@/models';



export default function ResultsList ({ results }: { results: Results }) {

    return (
        <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Video ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Duration(s)</th>
              <th className="border p-2">Views</th>
              <th className="border p-2">Likes</th>
              <th className="border p-2">Comments</th>
              <th className="border p-2">Published</th>
              <th className="border p-2">Channel</th>
              <th className="border p-2">Language</th>
            </tr>
          </thead>
          <tbody>
            {results?.videos?.map((video) => (
              <tr key={video.video_id}>
                <td className="border p-2">{video.video_id}</td>
                <td className="border p-2">{video.title}</td>
                <td className="border p-2">{video.duration}</td>
                <td className="border p-2">{video.view_count?.toLocaleString() || '0'}</td>
                <td className="border p-2">{video.likes?.toLocaleString() || '0'}</td>
                <td className="border p-2">{video.comments?.toLocaleString() || ''}</td>
                <td className="border p-2">{video.published_at}</td>
                <td className="border p-2">{video.channel_name} (@{video.channel_id})</td>
                <td className="border p-2">{video.language_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}