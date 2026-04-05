/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    // Force disable native SWC binaries and use WASM fallback for WebContainer compatibility
    experimental: {
        forceSwcTransforms: true,
    }
};

module.exports = nextConfig;
