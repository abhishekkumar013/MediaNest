"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types';
import { AlertCircle, Loader } from 'lucide-react';

function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/video");
            if (Array.isArray(response.data)) {
                setVideos(response.data);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error(error);
            setError("Failed to fetch videos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleDownload = useCallback((url: string, title: string) => {
        console.log(url);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">Videos</h1>
            
            {error && (
                <div className="alert alert-error mb-6">
                    <AlertCircle className="w-6 h-6" />
                    <span>{error}</span>
                </div>
            )}
            
            {videos.length === 0 ? (
                <div className="text-center text-lg text-gray-500 p-8 bg-base-200 rounded-lg shadow text-white">
                    No videos available
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;