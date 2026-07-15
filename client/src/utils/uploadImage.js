export async function uploadImage(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "lms_profile");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/m2vinq9q/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  return data.url;
}