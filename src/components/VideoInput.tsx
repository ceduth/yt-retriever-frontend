import { useState } from "react";


export default function VideoInput(props: {videoIds: string, onChange: (ids: string) => void}) {

    const [videoIds, setVideoIds] = useState(props.videoIds)
    
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter YouTube video IDs or URLs (one per line or comma-separated)
            </label>
            <textarea 
            value={videoIds}
            onChange={(e) => {
                setVideoIds(e.target.value)
                props.onChange?.(e.target.value)  
            }}
            placeholder="Example:
                uuo2KqoJxsc
                https://www.youtube.com/watch?v=UJfX-ZrDZmU
                youtu.be/0_jC8Lg-oxY"
            className="w-full p-2 border rounded"
            rows={4}
            />
        </div>
    )
}