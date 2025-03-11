import { v2 as cloudinary } from "cloudinary";

export const  uploadPdf = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "pdf_uploads",
            resource_type: "raw", // Ensure Cloudinary treats it as a file, not an image
        });
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload PDF");
    }
};
