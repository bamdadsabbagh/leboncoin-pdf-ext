/**
 * @description Encodes an image to base64
 * @param {string} url - The url of the image to encode
 * @returns {Promise<string>} - The base64 encoded image
 */
export async function convertToBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  reader.readAsDataURL(blob);

  return new Promise((resolve) => {
    reader.onloadend = () => {
      const base64 = reader.result;
      // const validBase64 = base64.split (',')[1]
      resolve(base64);
    };
  });
}