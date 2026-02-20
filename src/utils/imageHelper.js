// Helper function to get product image
// Since backend returns image filenames, we need to import them from Assets
export const getProductImage = (imageName) => {
    try {
        // Try to import the image from Assets folder
        // require() returns a module with a default property
        const imageModule = require(`../Components/Assets/${imageName}`);
        return imageModule.default || imageModule;
    } catch (error) {
        // If image not found, return a placeholder
        console.warn(`Image ${imageName} not found, using placeholder`);
        try {
            const fallback = require('../Components/Assets/product_1.png');
            return fallback.default || fallback;
        } catch (e) {
            console.error('Fallback image also failed to load');
            return null;
        }
    }
};
