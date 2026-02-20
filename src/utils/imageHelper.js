// Import all local images at build time
import product_1 from '../Components/Assets/product_1.png';
import product_2 from '../Components/Assets/product_2.png';
import product_3 from '../Components/Assets/product_3.png';
import product_4 from '../Components/Assets/product_4.png';
import product_5 from '../Components/Assets/product_5.png';
import product_6 from '../Components/Assets/product_6.png';
import product_7 from '../Components/Assets/product_7.png';
import product_8 from '../Components/Assets/product_8.png';
import product_9 from '../Components/Assets/product_9.png';
import product_10 from '../Components/Assets/product_10.png';
import product_11 from '../Components/Assets/product_11.png';
import product_12 from '../Components/Assets/product_12.png';

// Map of local image filenames to imported images
const localImages = {
    'product_1.png': product_1,
    'product_2.png': product_2,
    'product_3.png': product_3,
    'product_4.png': product_4,
    'product_5.png': product_5,
    'product_6.png': product_6,
    'product_7.png': product_7,
    'product_8.png': product_8,
    'product_9.png': product_9,
    'product_10.png': product_10,
    'product_11.png': product_11,
    'product_12.png': product_12,
};

// Helper function to get product image
// Handles both external URLs and local asset filenames
export const getProductImage = (imageName) => {
    // If it's an external URL (starts with http:// or https://), return it directly
    if (imageName && (imageName.startsWith('http://') || imageName.startsWith('https://'))) {
        return imageName;
    }

    // Otherwise, try to load from local images map
    if (imageName && localImages[imageName]) {
        return localImages[imageName];
    }

    // If image not found, return placeholder
    console.warn(`Image ${imageName} not found, using placeholder`);
    return product_1; // Default fallback
};
