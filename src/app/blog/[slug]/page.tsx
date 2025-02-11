import { DateTime } from 'luxon';
import { indexGenerator, NotionBlock, rnrSlugify } from '@9gustin/react-notion-render'
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import '@/app/notion.css';
import { getPost, getPosts } from '@/lib/notion';
import RenderNotion from '@/components/RenderNotion';

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
        <h1 className="text-2xl md:text-5xl lg:text-6xl text-moss-green-200">{post.title}</h1>
        <time dateTime={post.date} className="text-black-sand">
          {DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_FULL)}
        </time>
      </div>
      <div className="flex pb-12 gap-12">
        <div className="md:w-4/5">
          <RenderNotion
            blocks={blocks as BlockObjectResponse[]}
          />
        </div>
        <div className="hidden md:block sticky top-40 w-1/5 h-fit text-sm space-y-6 text-black-sand py-2">
          <div>
            <h3 className="uppercase tracking-wide mb-1 text-moss-green-200">
              Table of Contents
            </h3>
            <ul className="list-disc pl-4">
              {
                indexGenerator(blocks as NotionBlock[]).map(({ id, plainText }) => (
                  <li key={id}>
                    <a href={`#${rnrSlugify(plainText)}`}>
                      {plainText}
                    </a>
                  </li>
                ))
              }
            </ul>
          </div>
          <div>
            <h3 className="uppercase tracking-wide mb-1 text-moss-green-200">
              Tags
            </h3>
            {post.tags.map(t => {
              return (
                <span
                  key={t.id}
                  className="block text-xs w-fit p-1 mb-1 rounded-md opacity-60 text-white-water"
                  style={{ backgroundColor: t.color }}
                >
                  {`#${t.name}`}
                </span>
              )
            })}
          </div>
          <Link href="/blog" className="uppercase flex items-center text-moss-green-200">
            Back
            <ArrowRightIcon className="w-4 ml-1"/>
          </Link>
        </div>
      </div>
    </div>
  );
}
