const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design/icons', 'rc-util'],
  // 配置 `pageExtensions` 以包含 MDX 文件
  pageExtensions: ['js', 'jsx', 'ts', 'mdx', 'tsx'],
  // 解决跨域问题
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    // 确保 MQTT 客户端在服务器端初始化
    config.node = {
      ...config.node,
    };

    return config;
  },
};


module.exports = withMDX(nextConfig);
