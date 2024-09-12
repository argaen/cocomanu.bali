import Image from "next/image";

export type IntroductionProps = {
  image: string;
};

export default function Introduction({
  image,
}: IntroductionProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-black-sand">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-16 px-10">
        <div className="flex flex-col items-center h-5/6 md:w-4/6 lg:w-3/6 gap-16">
          <h2 className="text-3xl lg:text-5xl text-center text-moss-green-300 px-8">
            Where Work & Life Flow
          </h2>
          <Image
            src={`${process.env.BASE_PATH}${image}`}
            alt="Intro"
            width="200"
            height="200"
            className="object-cover aspect-square rounded-full sm:hidden"
          />
          <div className="space-y-6 w-5/6">
            <p>
              Welcome to the first coworking and coliving space in the Medewi area.
            </p>
            <p>
              Here, your day starts with sunrise surf sessions and ends with wild sunsets over black sand beaches.
            </p>
            <p>
              In between, you&apos;ll find a peaceful spot to focus, surrounded by the natural beauty of West Bali.
            </p>
            <p>
              At Cocomanu, we&apos;ve created a place where you can get things done and enjoy the simple pleasures of island life.
            </p>
          </div>
        </div>
        <div className="hidden relative aspect-square h-[200px] md:h-[300px] lg:h-[400px] sm:block">
          <Image
            src={`${process.env.BASE_PATH}${image}`}
            alt="Intro"
            fill
            className="object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
