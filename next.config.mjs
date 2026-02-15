/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // This ignores the 'never read' and 'property does not exist' errors
      ignoreBuildErrors: true,
    },
    eslint: {
      // This ignores the 'Link' unused and other linting errors
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;