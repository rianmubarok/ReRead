import { supabase } from "@/lib/supabase";

export async function uploadAvatarFromUrl(userId: string, imageUrl: string): Promise<string | null> {
    if (!supabase) {
        console.warn("Supabase not configured, skipping avatar upload");
        return null;
    }

    try {
        // 1. Fetch the image from the URL
        // If it's a Google URL, it typically has necessary headers, but fetch should work.
        const response = await fetch(imageUrl);
        if (!response.ok) {
            if (response.status === 429) {
                console.warn("Rate limited by Google when fetching avatar (429). Using original URL.");
            } else {
                console.error("Failed to fetch image from URL:", imageUrl, response.status, response.statusText);
            }
            return null;
        }
        const blob = await response.blob();

        // 2. Define the path in Supabase Storage
        // We'll use a fixed name 'avatar.jpg' (or detect mime type, but .jpg usually works for avatars)
        // or we can use the original file extension if we can guess it.
        // Google avatars are usually JPEGs.
        const filePath = `users/${userId}/avatar-${Date.now()}.jpg`;

        // 3. Upload to 'avatars' bucket
        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(filePath, blob, {
                upsert: true,
                contentType: blob.type || "image/jpeg",
            });

        if (error) {
            console.error("Supabase storage upload error:", error);
            return null;
        }

        // 4. Get the Public URL
        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;

    } catch (err) {
        console.error("Error uploading avatar:", err);
        return null;
    }
}

export async function uploadBookImage(file: File): Promise<string | null> {
    if (!supabase) {
        console.warn("Supabase not configured, skipping book image upload");
        return null;
    }

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from("book-covers")
            .upload(filePath, file);

        if (error) {
            console.error("Error uploading book image:", error);
            return null;
        }

        const { data } = supabase.storage
            .from("book-covers")
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (err) {
        console.error("Error in uploadBookImage:", err);
        return null;
    }
}
