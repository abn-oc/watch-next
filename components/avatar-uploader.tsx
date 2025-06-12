"use client";
import { useState } from 'react';
import { createClient } from "@/lib/supabase/client";

export default function AvatarUploader({ userId, onUploadSuccess }: { userId: string, onUploadSuccess: (url: string) => void; }) {

    const supabase = createClient();
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log("got file");
        console.log(file);
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}.${fileExt}`;

        console.log(`uploading in: ${filePath}`)

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
            });

        if (uploadError) {
            console.log(uploadError);
            alert('Upload failed');
            setUploading(false);
            return;
        }

        console.log("uploaded on bucket")

        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        const avatarUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('uid', userId);

        if (updateError) {
            alert('Failed to update avatar URL');
        }

        setUploading(false);

        onUploadSuccess?.(avatarUrl);
    };

    return (
        <div>
            <input type="file" onChange={handleUpload} accept="image/*" disabled={uploading} />
        </div>
    );
}
