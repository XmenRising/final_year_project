/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the experimental.appDir property
  images: {
    domains: ['firebasestorage.googleapis.com'], // For Firebase Storage images
  },
  // Add other configurations here
};

export default nextConfig;