import axios, { AxiosProgressEvent } from 'axios';

interface UploadResponse {
  uploadUrl: string;
  viewUrl: string;
}

async function uploadFileToS3(
  file: File, 
  filePathInS3: string,
  setUploadPercentage?: (percentage: number) => void
): Promise<string> {
  try {
    const fileName = file.name;
    const fileType = file.type;
    const folderPath = filePathInS3;

    const { data } = await axios.post<UploadResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/uploadUrl`, {
      fileName,
      fileType,
      folderPath
    },
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    }
    );

    const { uploadUrl, viewUrl } = data;

    const res = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': fileType,
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (setUploadPercentage && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(percentCompleted);
        }
      },
    });

    return viewUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

async function deleteFileS3(
  filePathInS3: string,
): Promise<string> {
  try {

    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/`, {
      data: { fileUrl:filePathInS3 },
      headers: {
        'Content-Type': 'application/json', // Optional, depending on server config
      },
      withCredentials: true, // If you need credentials like cookies
    });

    if(res.status === 200)
      return 'success';
    
    return "fail"
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export { uploadFileToS3, deleteFileS3 };

