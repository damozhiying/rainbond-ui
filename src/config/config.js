let baseUrl = "";
let imageUploadUrl = "";
if (process.env.NODE_ENV === "dev") {
  baseUrl = "http://gr-debug.goodrain.com/";
} else if (process.env.NODE_ENV === "development") {
  // baseUrl = '/api';
  baseUrl = "http://dev.goodrain.org";
  // baseUrl = "http://39.96.22.211:7070";
} else if (process.env.NODE_ENV === "production") {
  baseUrl = "";
}

imageUploadUrl = `${baseUrl}/console/files/upload`;
const config = {
  baseUrl,
  imageUploadUrl,
};
export default config;
