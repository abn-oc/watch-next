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
    CardDescription,
} from "@/components/ui/card";
import AvatarUploader from "@/components/avatar-uploader";
import { ArrowLeft, Loader2, User, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();

    const [uid, setUid] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatar_url, setAURL] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    }, [supabase]);

    const handleUpdate = async () => {
        if (!uid) return;

        if (username.trim() === "") {
            setError("Username cannot be empty.");
            return;
        }

        setSaving(true);
        setError(null);
        setStatus(null);

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ username, bio, avatar_url })
            .eq("uid", uid);

        if (updateError) {
            setError(updateError.message);
        } else {
            setStatus("Profile updated successfully!");
            setTimeout(() => setStatus(null), 3000);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-destructive text-lg mb-4">{error}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.back()}
                            className="hover:bg-muted"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <CardTitle className="text-2xl">Edit Profile</CardTitle>
                            <CardDescription>
                                Update your profile information and preferences
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                                <Image
                                    src={avatar_url || '/default.jpg'}
                                    alt="Avatar"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {uid && (
                                <div className="absolute -bottom-1 -right-1">
                                    <AvatarUploader userId={uid} onUploadSuccess={(url) => setAURL(url)}/>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-base">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-base">Bio</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button 
                            onClick={handleUpdate} 
                            disabled={username.trim() === "" || saving}
                            className="w-full"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                        
                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}
                        {status && (
                            <p className="text-sm text-green-500 text-center">{status}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
