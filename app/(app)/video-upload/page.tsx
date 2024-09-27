"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

const VideoUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size too large. Maximum size is 70MB.");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      console.log(response);
      router.push("/");
    } catch (error) {
      console.error(error);
      setError("An error occurred while uploading the video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2x text-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full text-white"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full text-white h-24"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full text-white"
            required
          />
          <p className="text-sm mt-2 text-gray-400">Maximum file size: 70MB</p>
        </div>
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoUploadPage;