import Link from 'next/link';
import Image from 'next/image';
import { DateTime } from 'luxon';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import { getPosts } from '@/lib/notion';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {posts.map((post) => (
        <li key={post.title} className="py-12">
          <article>
            <div className="flex items-stretch gap-4">
              <div className="relative w-full h-auto">
                <Image
                  src={post.image}
                  alt="test"
                  fill
                  loading="lazy"
                  className="object-cover rounded-md"
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-bold">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <span>
                      <time dateTime={post.date}>
                        {DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_FULL)}
                      </time>
                      {' '}
                      |
                      {' '}
                      {post.reading}min read
                    </span>
                  </div>
                  <div className="prose max-w-none">
                    {post.summary}
                    ..
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end font-medium leading-6">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="cta before:bg-moss-green-100"
                    aria-label={`Read "${post.slug}"`}
                  >
                    <span className="flex items-center py-1 px-2 z-10">
                      Read more
                      <ArrowRightIcon className="size-4 ml-1 font-bold"/>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
