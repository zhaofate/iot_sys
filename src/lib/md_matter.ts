import fs from "fs";
import { join } from "path";
import { matter } from 'gray-matter';


const postsDir = join(process.cwd(), 'mdx-page');

type MetaData = {
  title: string;
  date: Date;
  category: string;
  tags?: string[];
  description?: string;
  draft?: boolean;
};

// 根据文件名读取 markdown 文档内容
export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");

  const fullPath = join(postsDir, `${realSlug}.md`);

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 解析 markdown 元数据
  const { data, content, excerpt } = matter(fileContents, {
    excerpt: true,
  });

  // 配置文章元数据
  const meta = { ...data } as MetaData;

  return { slug: realSlug, meta, content, excerpt };
}

// 获取 /posts文件夹下所用markdown文档
export function getAllPosts() {
  const slugs = fs.readdirSync(postsDir);

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // 排除草稿文件
    .filter((c) => !/\.draft$/.test(c.slug));
    // .filter((c) => !c.meta.draft);
  return posts.sort((a, b) => +b.meta.date - +a.meta.date);
}
