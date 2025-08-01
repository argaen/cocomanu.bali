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
              <Image
                src={post.image}
                alt="test"
                width={250}
                height={250}
                loading="lazy"
                className="object-cover rounded-md aspect-square"
              />

              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-bold text-moss-green-200">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <span className="text-black-sand opacity-60">
                      <time dateTime={post.date}>
                        {DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_FULL)}
                      </time>
                      {' '}
                      |
                      {' '}
                      {post.reading}min read
                    </span>

                    <div className="block space-x-1">
                      {post.tags.map(t => {
                        return (
                          <span
                            key={t.id}
                            className="text-xs w-fit p-1 mb-1 rounded-md opacity-60 text-white-water"
                            style={{ backgroundColor: t.color }}
                          >
                            {`#${t.name}`}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="prose max-w-none text-black-sand">
                    {post.summary}
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end font-medium leading-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="cta bg-moss-green-200 before:bg-moss-green-100"
                    aria-label={`Read "${post.slug}"`}
                  >
                    <span className="flex text-white-water items-center py-1 px-2 z-10">
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
