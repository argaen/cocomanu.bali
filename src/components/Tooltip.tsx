"use client";

import React from 'react';
import { Tooltip, ITooltip } from 'react-tooltip';

export type TooltipProps = ITooltip & React.PropsWithChildren;

export default function CustomTooltip({
  children,
  className,
  ...props
}: TooltipProps): React.JSX.Element {
  return (
    <Tooltip
      className={`!bg-rainy-day !text-black-sand shadow-xl !rounded-lg !z-50 !opacity-100 whitespace-pre-wrap !overflow-visible ${className}`}
      delayShow={100}
      {...props}
    >
      {children}
    </Tooltip>
  );
}
