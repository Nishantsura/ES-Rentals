import { storage, auth } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImages = async (files: FileList, carId: string): Promise<string[]> => {
  // Check if user is authenticated
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to upload images');
  }

  const uploadPromises = Array.from(files).map(async (file) => {
    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
    
    // Create reference to the file location in Firebase Storage
    const storageRef = ref(storage, `cars/${carId}/images/${filename}`);
    
    try {
      // Get auth token
      const token = await user.getIdToken();
      
      // Upload the file with metadata including auth token
      const metadata = {
        customMetadata: {
          uploadedBy: user.uid,
          uploadTime: new Date().toISOString()
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  });

  // Wait for all uploads to complete
  const urls = await Promise.all(uploadPromises);
  return urls;
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  // Check if user is authenticated
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to upload images');
  }

  // Create reference to the file location in Firebase Storage
  const storageRef = ref(storage, path);
  
  try {
    // Get auth token
    const token = await user.getIdToken();
    
    // Upload the file with metadata including auth token
    const metadata = {
      customMetadata: {
        uploadedBy: user.uid,
        uploadTime: new Date().toISOString()
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
