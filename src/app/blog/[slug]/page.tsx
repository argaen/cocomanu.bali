import { DateTime } from 'luxon';
import type { Metadata } from 'next';

import '@/app/notion.css';
import { getPost, getPosts } from '@/lib/notion';
import NotionArticle from '@/components/notion/NotionArticle';

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
    <NotionArticle
      title={post.title}
      subtitle={
        <div>
          <time dateTime={post.date}>
            {DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_FULL)}
          </time>
          {' '}
          |
          {' '}
          {post.reading}min read
        </div>
      }
      content={blocks}
      tags={post.tags}
    />
  );
}
