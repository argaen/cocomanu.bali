import {twMerge} from "tailwind-merge";

export type IntroductionProps = {
  title: string;
  titleClassName?: string;
  image: JSX.Element;
  content: string | JSX.Element;
};

export default function Introduction({
  title,
  titleClassName = '',
  image,
  content,
}: IntroductionProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-black-sand md:px-6 lg:px-12">
      <div className="flex flex-col sm:flex-row items-center justify-center md:gap-24 px-10">
        <div className="flex flex-col items-center h-5/6 md:w-4/6 lg:w-3/6 gap-8 intersect:animate-fade-right intersect-once animate-delay-300">
          <h2 className={twMerge("text-3xl lg:text-5xl text-center px-8", titleClassName)}>
            {title}
          </h2>
          <div className="relative h-[200px] w-[200px] sm:hidden">
            {image}
          </div>
          <div className="space-y-6 w-5/6">
            {content}
          </div>
        </div>
        <div className="hidden aspect-square h-[200px] md:h-[300px] lg:h-[400px] sm:flex items-center justify-center">
          {image}
        </div>
      </div>
    </div>
  );
}
