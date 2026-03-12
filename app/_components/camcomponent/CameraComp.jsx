"use client";
import Webcam from "react-webcam";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { supabase } from "@/utils/supabaseClient";
import { dataURLtoFile } from "@/utils/UrltoFile/dataURLtoFile";

export default function CameraComp() {
  const webRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const VIDEO_WIDTH = 320;
  const VIDEO_HEIGHT = 240;

  const capture = useCallback(() => {
    const imageSrc = webRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, []);

  const uploadToSupabase = async () => {
    setLoading(true);
    setUploadError(null);
    setUploadedUrl(null);

    if (!imgSrc) return;

    const file = dataURLtoFile(imgSrc, `photo_${Date.now()}.jpg`);
    // 'photos' is your bucket name; adjust path/filename as needed
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(`webcam-photos/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    setLoading(false);
    if (error) {
      setUploadError(error.message);
    } else {
      // You can now construct a public URL or get a signed URL
      const publicUrl = supabase.storage
        .from("photos")
        .getPublicUrl(`webcam-photos/${file.name}`).data.publicUrl;
      setUploadedUrl(publicUrl);
    }
  };

  return (
    <section className="flex flex-col items-center">
      <Webcam
        className="w-full"
        audio={false}
        ref={webRef}
        screenshotFormat="image/jpeg"
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        videoConstraints={{
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          facingMode: "user",
        }}
      />
      <button onClick={capture}>Take Photo</button>
      {imgSrc && (
        <div>
          <Image
            src={imgSrc}
            alt="Screenshot"
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
          />
          <button
            onClick={uploadToSupabase}
            disabled={loading}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload to Supabase"}
          </button>
        </div>
      )}
      {uploadedUrl && (
        <a
          href={uploadedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-blue-600 underline"
        >
          View Uploaded Image
        </a>
      )}
      {uploadError && <p className="text-red-500">Error: {uploadError}</p>}
    </section>
  );
}
