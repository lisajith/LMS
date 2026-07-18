import axios from "axios";

const CLOUD_NAME = "m2vinq9q";
const UPLOAD_PRESET = "lms_assignments";

export async function uploadAssignment(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    formData
  );

  return response.data;
}