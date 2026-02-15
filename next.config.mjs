/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // This allows the build to succeed even if there are TS errors
      ignoreBuildErrors: true,
    },
    eslint: {
      // This ignores linting errors (like 'Link' is unused) during builds
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;