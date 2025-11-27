import dummywatches from "../dummywatches.json";
import ImageKit from "imagekit";
import { watchs } from "@/database/schema";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
    
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not set in .env.local");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

const uploadToImageKit = async (url: string, fileName: string, folder: string): Promise<string | undefined> => {
    try {
        const response = await imageKit.upload({
            file: url,
            fileName,
            folder,
        });
        console.log(`Uploaded ${fileName} to ImageKit`);
        return response.url;
    } catch (error) {
        console.error(`Error uploading ${fileName} to ImageKit:`, error);
        return undefined;
    }
};

const seed = async () => {
    console.log('Starting database seeding...');
    console.log(`Found ${dummywatches.length} watches to seed`);
    
    try {
        console.log('Clearing existing watch data...');
        await db.delete(watchs);
        console.log('Existing data cleared successfully');
        
        for (const [index, watch] of dummywatches.entries()) {
            console.log(`\nProcessing watch ${index + 1}/${dummywatches.length}: ${watch.name}`);
            
            console.log('Uploading media to ImageKit...');
            const imageUrl = await uploadToImageKit(watch.imageUrl, `${watch.name.replace(/[^a-z0-9]/gi, '_')}.png`, "/watches/images");
            const videoUrl = await uploadToImageKit(watch.videoUrl, `${watch.name.replace(/[^a-z0-9]/gi, '_')}.mp4`, "/watches/videos");

            if (!imageUrl || !videoUrl) {
                console.error(`Skipping watch ${watch.name} due to upload errors`);
                continue;
            }

            console.log('Inserting into database...');
            await db.insert(watchs).values({
                ...watch,
                imageUrl: imageUrl,
                videoUrl: videoUrl
            });
            
            console.log(`Successfully seeded ${watch.name}`);
        }
        
        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error seeding database:", error);
        process.exit(1);
    }
};

seed().catch(error => {
    console.error("Unhandled error in seed function:", error);
    process.exit(1);
});