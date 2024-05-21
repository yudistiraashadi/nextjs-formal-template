/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: [
            "@mantine/charts",
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/dates",
            "@mantine/notifications",
            "@mantine/modals",
            "devextreme-react",
            "devextreme",
            "dayjs",
            "recharts",
            "zod"
        ],
    },
};

export default nextConfig;
