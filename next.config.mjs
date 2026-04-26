import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "plus.unsplash.com" },
            { protocol: "https", hostname: "picsum.photos" },      
            { protocol: "https", hostname: "fastly.picsum.photos" }, 
            { protocol: "https", hostname: "i.pravatar.cc" },

        ],
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            react: require.resolve("react"),
            "react-dom": require.resolve("react-dom"),
        };
        return config;
    },
};

export default nextConfig;