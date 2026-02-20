// Helper function to get product image
// Handles both external URLs and local asset filenames
export const getProductImage = (imageName) => {
    // If it's an external URL (starts with http:// or https://), return it directly
    if (imageName && (imageName.startsWith('http://') || imageName.startsWith('https://'))) {
        console.log(`Using external URL: ${imageName}`);
        return imageName;
    }

    // For local images, we'll let the browser handle them
    // This shouldn't happen with our current setup since all products use external URLs
    console.warn(`Local image requested: ${imageName} - this may not display correctly`);

    // Return a placeholder or the original name
    // In production, all products should use external URLs
    return imageName;
};
