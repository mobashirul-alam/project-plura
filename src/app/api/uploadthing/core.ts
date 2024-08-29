import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const authenticateUser = () => {
    // This code runs on your server before upload
    const user = auth();

    // If you throw, the user will not be able to upload
    if (!user) throw new Error("Unauthorized");

    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return user;
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    subAccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .middleware(authenticateUser)
        .onUploadComplete(() => {}),
    avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(authenticateUser)
        .onUploadComplete(() => {}),
    agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(authenticateUser)
        .onUploadComplete(() => {}),
    media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(authenticateUser)
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
