import axios, { AxiosProgressEvent } from 'axios';

interface UploadResponse {
  uploadUrl: string;
  viewUrl: string;
}

async function uploadFileToS3(
  file: File, 
  setUploadPercentage?: (percentage: number) => void
): Promise<string> {
  try {
    const fileName = file.name;
    const fileType = file.type;

    const { data } = await axios.post<UploadResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/getUploadUrl`, {
      fileName,
      fileType,
    },
    { withCredentials: true }
    );

    const { uploadUrl, viewUrl } = data;

    console.log(uploadUrl,viewUrl)

    await axios.put(uploadUrl, file, {
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

export default uploadFileToS3;
