import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { indexGenerator, NotionBlock, rnrSlugify } from '@9gustin/react-notion-render'
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import RenderNotion from '@/components/notion/RenderNotion';

export type NotionArticleProps = {
  title: string;
  subtitle: string | React.JSX.Element;
  image?: string;
  content: NotionBlock[];
  tags: {
    id: string,
    color: string,
    name: string,
  }[];
  extraInfo?: React.JSX.Element;
}

export default function NotionArticle({
  title,
  subtitle,
  image,
  content,
  tags,
  extraInfo,
}: NotionArticleProps) {
  return (
    <div className="py-12">
      {
        image && (
          <div className="relative h-[400px] w-full mr-4 mb-4">
            <Image
              src={image}
              alt="Hero"
              fill
              className="object-cover rounded-md"
            />
          </div>
        )
      }
      <div className="pb-6 space-y-3">
        <div>
          <h1 className="text-2xl md:text-5xl lg:text-6xl text-moss-green-200">{title}</h1>
          <h3 className="text-lg md:text-xl text-black-sand opacity-60">{subtitle}</h3>
        </div>

        <div className="md:hidden flex gap-2">
          {tags.map(t => {
            return (
              <span
                key={t.id}
                className="block text-xs w-fit p-1 mb-1 rounded-md opacity-80 text-white-water"
                style={{ backgroundColor: t.color }}
              >
                {`#${t.name}`}
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex gap-12 pb-6">
        <div className="md:w-4/5">
          <RenderNotion blocks={content} />
        </div>
        <div className="hidden md:block sticky top-40 w-1/5 h-fit text-base space-y-6 text-black-sand py-2">
          {extraInfo}
          <div>
            <h3 className="uppercase tracking-wide mb-1 text-moss-green-200">
              Table of Contents
            </h3>
            <ul className="list-disc pl-4">
              {
                indexGenerator(content as NotionBlock[]).map(({ id, plainText }) => (
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
            {tags.map(t => {
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
            <ArrowLeftIcon className="w-4 mr-1"/>
            Back
          </Link>
        </div>
      </div>

      <Link href="/garden/plants" className="md:hidden uppercase w-full flex items-center text-moss-green-200">
        <ArrowLeftIcon className="w-4 mr-1"/>
        Back
      </Link>
    </div>
  )

}
