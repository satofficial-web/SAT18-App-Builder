// This tells TypeScript that the JSZip variable is available globally,
// since we are loading it from a <script> tag in index.html.
declare var JSZip: any;

interface ZipValidationResult {
    fileCount: number;
    indexPath: string;
}

/**
 * Processes the user-uploaded web project ZIP file.
 * It opens the ZIP, validates its contents, and finds the entry point (index.html).
 * 
 * @param file The .zip file provided by the user.
 * @returns A promise that resolves with validation results.
 * @throws An error if the file is invalid or doesn't meet criteria.
 */
export const processWebProjectZip = async (file: File): Promise<ZipValidationResult> => {
    if (!file || file.type !== 'application/zip') {
        throw new Error('Invalid file type. Please upload a .zip file.');
    }

    const zip = await JSZip.loadAsync(file);
    const files = Object.keys(zip.files);
    
    if (files.length === 0) {
        throw new Error('The ZIP file is empty.');
    }

    // Find index.html, allowing it to be in a subdirectory (e.g., dist/index.html)
    const indexPath = files.find(path => path.endsWith('index.html') && !path.startsWith('__MACOSX'));
    
    if (!indexPath) {
        throw new Error('Validation failed: Could not find an index.html file in the ZIP.');
    }

    return {
        fileCount: files.length,
        indexPath: indexPath,
    };
};
