'use client';

import { useState, useRef } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { Camera, Loader2 } from "lucide-react";

export default function AvatarUploader({
  userId,
  onUploadSuccess,
}: {
  userId: string;
  onUploadSuccess: (url: string) => void;
}) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${userId}_${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      alert('Upload failed');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('uid', userId);

    if (updateError) {
      console.error(updateError);
      alert('Failed to update avatar URL');
    }

    setUploading(false);
    onUploadSuccess?.(avatarUrl);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        onChange={handleUpload}
        accept="image/*"
        disabled={uploading}
        className="hidden"
      />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="rounded-full w-8 h-8 shadow-md hover:shadow-lg transition-shadow"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
