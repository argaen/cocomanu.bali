import { twMerge } from 'tailwind-merge';

interface ArrowRightProps {
  className?: string;
}

export default function ArrowRight({ className }: ArrowRightProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 28 47'
      className={twMerge('', className)}
    >
      <path
        d="M27.2666 23.136C27.2666 22.0426 26.8293 21.004 26.0639 20.2386L6.98527 1.26931C6.21994 0.449315 5.18127 0.0666494 4.14261 0.0666494C3.04927 0.0666493 2.01061 0.449315 1.19061 1.26931C-0.394727 2.90931 -0.394731 5.47865 1.24527 7.06398L17.3719 23.136L1.24527 39.208C-0.394733 40.7933 -0.394729 43.4173 1.1906 45.0026C2.8306 46.6426 5.39993 46.6426 6.98527 45.0026L26.0639 26.0333C26.8293 25.268 27.2666 24.2293 27.2666 23.136Z"
      />
    </svg>
  );
}
