import { twMerge } from 'tailwind-merge';

interface ArrowLeftProps {
  className?: string;
}

export default function ArrowLeft({ className }: ArrowLeftProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 28 47'
      className={twMerge('', className)}
    >
      <path
        d="M-1.00839e-06 23.1633C-9.60601e-07 24.2567 0.437331 25.2953 1.20266 26.0607L20.2813 45.03C21.0467 45.85 22.0853 46.2327 23.124 46.2327C24.2173 46.2327 25.256 45.85 26.076 45.03C27.6613 43.39 27.6613 40.8207 26.0213 39.2353L9.89467 23.1633L26.0213 7.09134C27.6613 5.506 27.6613 2.88201 26.076 1.29667C24.436 -0.343328 21.8667 -0.343327 20.2813 1.29667L1.20266 20.266C0.437331 21.0313 -1.05618e-06 22.07 -1.00839e-06 23.1633Z"
      />
    </svg>
  );
}
