import { twMerge } from 'tailwind-merge';

interface NoteProps {
  className?: string;
}

export default function Note({ className }: NoteProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      viewBox='0 0 8 17'
      className={twMerge('', className)}
    >
      <path
        d="M5.59286 14.2471C5.8762 13.2155 6.11429 12.1671 6.45477 11.1546C7.00477 9.50922 6.75714 8.02624 5.7619 6.62445C4.89524 5.40415 4.06429 4.15758 3.04286 2.99459L3.28809 5.89131C3.43571 7.65131 3.38334 9.46146 3.79048 11.1618C4.19762 12.8573 3.64524 14.1182 2.75714 15.3767C2.27857 16.0573 1.76191 16.1767 1.07857 15.8734C0.31905 15.5367 -0.023805 14.9086 0.00952829 14.1659C0.0785759 12.5636 1.12857 11.7444 2.44285 11.0638C2.36905 9.54743 2.30238 8.04056 2.21666 6.53608C2.1238 4.85489 2.00953 3.17608 1.91191 1.49489C1.89524 1.194 1.86667 0.878773 1.93096 0.589818C1.98096 0.372505 2.13572 0.0644449 2.30477 0.0190718C2.46429 -0.0239133 2.81904 0.171908 2.88809 0.343848C3.83333 2.70325 5.50714 4.61131 6.81905 6.74146C7.55714 7.94026 7.81191 9.2131 7.39048 10.5815C6.98572 11.8901 6.49285 13.1606 5.89285 14.3856C5.79285 14.3403 5.69286 14.2925 5.59286 14.2471Z"
      />
    </svg>
  );
}