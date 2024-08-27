import { createCanvas, loadImage } from 'canvas';

export const createAOMap = async (imageBuffer: Buffer): Promise<Buffer> => {
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const outputData = ctx.createImageData(img.width, img.height);
    
    const radius = 1;
    
    // Calculate AO map...
    for (let y = 1; y < img.height - 1; y++) {
        for (let x = 1; x < img.width - 1; x++) {
            const baseIndex = (y * img.width + x) * 4;
            
            let occlusion = 0;
            let avgBrightness = 0;
            
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    if (dy === 0 && dx === 0) continue; // Skip center pixel

                    const neighborX = x + dx;
                    const neighborY = y + dy;
                    const neighborIndex = (neighborY * img.width + neighborX) * 4;

                    const brightness = (imageData.data[neighborIndex] + 
                                        imageData.data[neighborIndex + 1] + 
                                        imageData.data[neighborIndex + 2]) / 3;

                    avgBrightness += brightness;

                    if (brightness < 128) {
                        occlusion++;
                    }
                }
            }

            avgBrightness /= (radius * 2 + 1) * (radius * 2 + 1) - 1;
            outputData.data[baseIndex] = Math.max(0, Math.min(255, avgBrightness - occlusion));
            outputData.data[baseIndex + 1] = outputData.data[baseIndex];
            outputData.data[baseIndex + 2] = outputData.data[baseIndex];
            outputData.data[baseIndex + 3] = 255; // Alpha
        }
    }

    ctx.putImageData(outputData, 0, 0);
    return canvas.toBuffer('image/png');
};

export const createNormalMap = async (imageBuffer: Buffer): Promise<Buffer> => {
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const outputData = ctx.createImageData(img.width, img.height);
    
    for (let y = 1; y < img.height - 1; y++) {
        for (let x = 1; x < img.width - 1; x++) {
            const baseIndex = (y * img.width + x) * 4;

            const neighbors = [
                (y - 1) * img.width + x,   // Top
                (y + 1) * img.width + x,   // Bottom
                y * img.width + (x - 1),   // Left
                y * img.width + (x + 1),   // Right
            ];

            // Gradient calculations
            const gx = (imageData.data[neighbors[2] * 4] - imageData.data[neighbors[3] * 4]) / 255;
            const gy = (imageData.data[neighbors[0] * 4] - imageData.data[neighbors[1] * 4]) / 255;

            outputData.data[baseIndex] = (gx + 1) * 127.5; // Red
            outputData.data[baseIndex + 1] = (gy + 1) * 127.5; // Green
            outputData.data[baseIndex + 2] = 255; // Blue
            outputData.data[baseIndex + 3] = 255; // Alpha
        }
    }

    ctx.putImageData(outputData, 0, 0);
    return canvas.toBuffer('image/png');
};