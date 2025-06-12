"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import AvatarUploader from "@/components/avatar-uploader";

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();

    const [uid, setUid] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatar_url, setAURL] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {

        (async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            setUid(user.id);

            const { data: profiles, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("uid", user.id);

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }

            if (profiles.length > 0) {
                const profile = profiles[0];
                setUsername(profile.username || "");
                setBio(profile.bio || "");
                setAURL(profile.avatar_url)
            } else {
                const { error: insertError } = await supabase.from("profiles").insert([
                    {
                        uid: user.id,
                        username: user.email ? user.email : "",
                        bio: "",
                    },
                ]);
                if (insertError) {
                    setError(insertError.message);
                }
            }

            setLoading(false);
        })()

    }, []);

    const handleUpdate = async () => {
        if (!uid) return;

        if (username.trim() === "") {
            setError("Username cannot be empty.");
            return;
        }

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ username, bio, avatar_url })
            .eq("uid", uid);

        if (updateError) {
            setError(updateError.message);
        } else {
            setError(null);
            setStatus("Profile updated!");
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <Card className="max-w-md mx-auto mt-10 p-4">
            <Button variant="link" className="mr-auto" onClick={() => router.back()}>{'<'}</Button>
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="avatar">Avatar</Label>
                    <Image
                        src={avatar_url || '/default.jpg'}
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                    />
                    {uid && <AvatarUploader userId={uid} onUploadSuccess={(url) => setAURL(url)}/>}
                </div>
                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <Button onClick={handleUpdate} disabled={username.trim() === ""}>
                    Save
                </Button>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {status && <p className="text-sm text-green-500">{status}</p>}
            </CardContent>
        </Card>
    );
}
