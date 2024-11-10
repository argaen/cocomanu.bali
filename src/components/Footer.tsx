import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

import Logo from '@/components/svg/Logo';
import Whatsapp from '@/components/svg/Whatsapp';
import Instagram from '@/components/svg/Instagram';

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="grid sm:grid-cols-2 sm:grid-flow-col gap-6 items-center p-14 bg-black-sand"
    >
      <div className="flex justify-center">
        <Logo className="h-20 sm:h-32 fill-white-water"/>
      </div>
      <ul className="text-base font-light space-y-2">
        <li className="flex">
          <EnvelopeIcon className="size-6 mr-2 fill-dawn-rays-200 text-black-sand" />
          <a href="mailto:cocomanubali@gmail.com">cocomanubali@gmail.com</a>
        </li>
        <li className="flex">
          <Whatsapp className="size-6 mr-2 fill-moss-green-200" />
          <a
            href="https://wa.me/6200000000"
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Chat with us in Whatsapp"
          >
            +62 0000 0000
          </a>
        </li>
        <li className="flex">
          <Instagram className="size-6 mr-2 fill-ocean-blue-200" />
          <a
            href="https://instagram.com/cocomanu.bali"
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Check out our Instagram"
          >
            @cocomanu.bali
          </a>
        </li>
        <li className="flex">
          <MapPinIcon className="size-6 mr-2 fill-dusk-glow-200 text-black-sand" />
          <a
            href="https://maps.app.goo.gl/yDVWHJBSST2vGGKY6"
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Where to find Cocomanu"
          >
            Yeh Sumbul, Mendoyo, Jembrana Regency, Bali 82262, Indonesia
          </a>
        </li>
      </ul>
    </footer>
    
  )
}
