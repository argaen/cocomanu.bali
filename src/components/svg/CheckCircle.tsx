import { twMerge } from 'tailwind-merge';

interface CheckCircleProps {
  className?: string;
}

export default function CheckCircle({ className }: CheckCircleProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 23 22'
      className={twMerge('', className)}
    >
      <path
        d="M11.5582 2.20972C6.62128 2.20972 2.60474 6.22626 2.60474 11.1632C2.60474 16.1002 6.62128 20.1167 11.5582 20.1167C16.4952 20.1167 20.5117 16.1002 20.5117 11.1632C20.5117 6.22626 16.4952 2.20972 11.5582 2.20972ZM9.76843 15.1144L6.444 11.7971L7.70823 10.5293L9.76664 12.5841L14.5066 7.84416L15.7726 9.11018L9.76843 15.1144Z"
      />
    </svg>
  );
}
