import { Request, Response } from 'express';
import axios from 'axios';
import { createNormalMap, createAOMap } from '../utils/imageProcessing'; // Your existing processing functions
import { Buffer } from 'buffer';

export const generateMap = async (req: Request, res: Response) => {
    try {
        const imageUrl = req.body.imageUrl; // Expecting image URL in the request body
        const mapType = req.body.mapType;

        let imageBuffer: Buffer;

        if (imageUrl) {
            // Fetch the image from the provided URL
            const response = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'arraybuffer',
            });

            imageBuffer = Buffer.from(response.data); // Convert the response data to a Buffer
        } else if (req.file && req.file.buffer) {
            // If an image file is directly uploaded
            imageBuffer = req.file.buffer;
        } else {
            return res.status(400).json({ error: 'Image file or URL is required' });
        }

        let generatedMap: Buffer;

        // Determine which map to generate
        if (mapType === 'normal') {
            generatedMap = await createNormalMap(imageBuffer);
        } else if (mapType === 'ao') {
            generatedMap = await createAOMap(imageBuffer);
        } else {
            return res.status(400).json({ error: 'Invalid map type. Use "normal" or "ao".' });
        }

        res.json({ map: `data:image/png;base64,${generatedMap.toString('base64')}` });
    } catch (error) {
        console.error('Error generating map:', error);
        res.status(500).json({ error: 'Error generating map' });
    }
};