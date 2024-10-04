import { CheckCircle } from "./svg";

export default function Pricing() {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-center px-6 gap-y-12 gap-6 lg:gap-16">
      <div className="bg-white-water text-black rounded-xl py-4 px-6 lg:px-12 mx-6 md:mx-0">
        <p className="font-extrabold text-3xl py-4">Day Pass</p>
        <span className="text-gray-400 py-2 text-base">What You&apos;ll Get</span>
        <ul className="py-4 space-y-4 text-sm">
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            1 free drink at the coffee bar
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Full access to shared facilities
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Unlimited phone booth usage
          </li>
        </ul>

        <p className="mt-6 py-4 text-2xl font-extrabold border-t-2 border-dashed">
          150K/
          <span className="text-base">
           day
          </span>
        </p>

        <button className="bg-moss-green-200 w-full text-white-water rounded-lg py-2">
          Choose
        </button>
      </div>

      <div className="bg-white-water text-black rounded-xl py-4 px-6 lg:px-12 mx-6 md:mx-0">
        <p className="font-extrabold text-3xl py-4">7-Day Pass</p>
        <span className="text-gray-400 py-2 text-base">What You&apos;ll Get</span>
        <ul className="py-4 space-y-4 text-sm">
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            3 free drinks at the coffee bar
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Full access to shared facilities
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Unlimited phone booth usage
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Members-only Whatsapp group
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            10-page printing credits
          </li>
        </ul>

        <p className="mt-6 py-4 text-2xl font-extrabold border-t-2 border-dashed">
          700K/
          <span className="text-base">
           week
          </span>
          <span className="text-base text-gray-400">
            {' '}
            (100k/day)
          </span>
        </p>

        <button className="bg-moss-green-200 w-full text-white-water rounded-lg py-2">
          Choose
        </button>
      </div>

      <div className="bg-white-water text-black rounded-xl py-4 px-6 lg:px-12 mx-6 md:mx-0">
        <p className="font-extrabold text-3xl py-4">30-Day Pass</p>
        <span className="text-gray-400 py-2 text-base">What You&apos;ll Get</span>
        <ul className="py-4 space-y-4 text-sm">
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            10 free drinks at the coffee bar
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Full access to shared facilities
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Unlimited phone booth usage
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Members-only Whatsapp group
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            30-page printing credits
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            4-hour group meeting room credits
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Dedicated reserved desk
          </li>
          <li className="flex">
            <CheckCircle className="size-4 mr-2" />
            Free business address
          </li>
        </ul>

        <p className="mt-6 py-4 text-2xl font-extrabold border-t-2 border-dashed">
          2.4M/
          <span className="text-base">
           month
          </span>
          <span className="text-base text-gray-400">
            {' '}
            (80k/day)
          </span>
        </p>

        <button className="bg-moss-green-200 w-full text-white-water rounded-lg py-2">
          Choose
        </button>
      </div>
    </div>
  );
}
