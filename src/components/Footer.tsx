import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

import Logo from '@/components/svg/Logo';
import Whatsapp from '@/components/svg/Whatsapp';
import Instagram from '@/components/svg/Instagram';

export default function Footer() {
  return (
    <div className="grid sm:grid-cols-2 sm:grid-flow-col gap-6 items-center p-14 bg-black-sand">
      <div className="flex justify-center">
        <Logo className="h-20 sm:h-32 fill-white-water"/>
      </div>
      <ul className="text-base font-light space-y-2">
        <li className="flex">
          <EnvelopeIcon className="size-6 mr-2 fill-dawn-rays-200 text-black-sand" />
          cocomanubali@gmail.com
        </li>
        <li className="flex">
          <Whatsapp className="size-6 mr-2 fill-moss-green-200" />
          +62 0000 0000
        </li>
        <li className="flex">
          <Instagram className="size-6 mr-2 fill-ocean-blue-200" />
          @cocomanu.bali
        </li>
        <li className="flex">
          <MapPinIcon className="size-6 mr-2 fill-dusk-glow-200 text-black-sand" />
          Yeh Sumbul, Mendoyo, Jembrana Regency, Bali 82262, Indonesia
        </li>
      </ul>
    </div>
    
  )
}
