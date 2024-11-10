import { Render } from '@9gustin/react-notion-render';
import { DateTime } from 'luxon';
import type { NotionBlock } from '@9gustin/react-notion-render';
import type { Metadata } from 'next';

import { getPost, getPosts } from '@/lib/notion';
import './notion.css';

export async function generateMetadata({
  params
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPost(slug);

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags.map(t => t.name),
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date
    },
    robots: {
      index: post.status === 'Done' ? true : false,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({
  params,
}: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const { slug } = await params;
  const { post, blocks } = await getPost(slug);

  return (
    <div>
      <div className="pb-6">
        <h1 className="text-moss-green-200">{post.title}</h1>
        <div className="sm:flex sm:justify-between">
          <time dateTime={post.date} className="text-black-sand">
            {DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_FULL)}
          </time>
          <div className="space-x-2">
            {post.tags.map(t => {
              return (
                <span
                  key={t.id}
                  className="p-1 rounded-md opacity-60 text-white-water"
                  style={{ backgroundColor: t.color }}
                >
                  {`#${t.name}`}
                </span>
              )
            })}
          </div>
        </div>
      </div>
      <div className="pb-12">
        <Render
          blocks={blocks as NotionBlock[]}
          classNames
        />
      </div>
    </div>
  );
}
