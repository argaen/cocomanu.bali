'use client';

import React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TextLogo } from './svg';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
]

export default function TopNav() {
  const path = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useState(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    if (typeof window !== "undefined") {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  });

  return (
    <div
      className="fixed w-screen top-0 z-20"
    >
      <Disclosure
        as="nav"
        role="navigation"
      >
        <div className={`p-2 sm:px-6 lg:px-8" transition-colors duration-300 ${isScrolled ? 'bg-rainy-day' : ''}`}>
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Link href="/" aria-label="Navigate to home">
                <TextLogo className="size-8 sm:size-36 py-2 fill-moss-green-200 w-auto" />
              </Link>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:ml-6 sm:pr-0">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-black-sand sm:hidden">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={path === item.href ? 'page' : undefined}
                      className={classNames(
                        path === item.href ? 'bg-moss-green-200 text-white-water' : 'hover:text-white-water hover:bg-moss-green-200',
                        'text-black-sand rounded-md px-3 py-2 font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel
          transition
          className="py-2 origin-top transition duration-500 ease-in-out data-[closed]:bg-transparent data-[closed]:-translate-y-6 data-[closed]:opacity-0 sm:hidden z-20 bg-rainy-day"
        >
          <div className="flex flex-col items-center space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={path === item.href ? 'page' : undefined}
                className={classNames(
                  path === item.href ? 'bg-black-sand' : 'text-black-sand',
                  'block rounded-md px-3 py-2 font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  )
}
