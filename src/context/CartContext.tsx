'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { ShoppingBagIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { formatPriceNumberAsK } from '@/lib/notion/product-price-format';
import {
  buildOrderWhatsappMessage,
  buildWhatsappOrderUrl,
} from '@/lib/order-whatsapp';
import CustomTooltip from '@/components/Tooltip';

const STORAGE_KEY = 'cocomanu-shop-cart';

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  packLabel: string;
  unitPriceIdr: number;
  quantity: number;
};

export type AddToCartInput = {
  productId: string;
  name: string;
  packLabel: string;
  unitPriceIdr: number;
  quantity?: number;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: AddToCartInput) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function newLineId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((item: AddToCartInput) => {
    const qty = item.quantity ?? 1;
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === item.productId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + qty,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: newLineId(),
          productId: item.productId,
          name: item.name,
          packLabel: item.packLabel,
          unitPriceIdr: item.unitPriceIdr,
          quantity: qty,
        },
      ];
    });
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  );

  const sendOrder = useCallback(() => {
    if (lines.length === 0) return;
    const message = buildOrderWhatsappMessage(
      lines.map((l) => ({
        name: l.name,
        packLabel: l.packLabel,
        quantity: l.quantity,
        unitPriceIdr: l.unitPriceIdr,
      })),
    );
    const url = buildWhatsappOrderUrl(message);
    clearCart();
    setIsOpen(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [lines, clearCart]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      isOpen,
      openCart,
      closeCart,
      addToCart,
      removeLine,
      clearCart,
      itemCount,
    }),
    [lines, isOpen, openCart, closeCart, addToCart, removeLine, clearCart, itemCount],
  );

  return (
    <CartContext.Provider value={value}>
      <CustomTooltip id="cart-line-remove" />
      <CustomTooltip id="cart-send-wa" />
      {children}
      <CartDialog
        isOpen={isOpen}
        onClose={closeCart}
        lines={lines}
        onRemove={removeLine}
        onSendOrder={sendOrder}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

function CartDialog({
  isOpen,
  onClose,
  lines,
  onRemove,
  onSendOrder,
}: {
  isOpen: boolean;
  onClose: () => void;
  lines: CartLine[];
  onRemove: (id: string) => void;
  onSendOrder: () => void;
}) {
  const totalIdr = lines.reduce((s, l) => s + l.unitPriceIdr * l.quantity, 0);
  const totalStr = totalIdr.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition duration-200 data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className="flex h-full w-full max-w-md flex-col bg-rainy-day shadow-xl transition duration-200 data-closed:translate-x-8 data-closed:opacity-0"
        >
          <div className="flex items-center justify-between border-b border-moss-green-300/30 px-4 py-3">
            <DialogTitle className="text-lg font-semibold text-black-sand">
              Cart
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-black-sand hover:bg-moss-green-200/20"
              aria-label="Close cart"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {lines.length === 0 ? (
              <p className="text-center text-black-sand/80 py-8">Your cart is empty.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex gap-3 rounded-md border border-moss-green-300/40 bg-white-water/80 p-3 text-black-sand"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-moss-green-200">{line.name}</p>
                      {line.packLabel.trim() ? (
                        <p className="text-sm opacity-80">{line.packLabel.trim()}</p>
                      ) : null}
                      <p className="text-sm mt-1">
                        x{line.quantity} · IDR {formatPriceNumberAsK(line.unitPriceIdr * line.quantity)}
                      </p>
                    </div>
                    <button
                      type="button"
                      data-tooltip-id="cart-line-remove"
                      data-tooltip-content="Remove from cart"
                      onClick={() => onRemove(line.id)}
                      className="shrink-0 cursor-pointer self-start rounded-md p-2 text-black-sand hover:bg-red-500/10 hover:text-red-800"
                      aria-label={`Remove ${line.name} from cart`}
                    >
                      <TrashIcon className="size-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 ? (
            <div className="border-t border-moss-green-300/30 px-4 py-4 space-y-3">
              <p className="text-lg font-semibold text-black-sand">
                Total: Rp {totalStr}
              </p>
              <button
                type="button"
                data-tooltip-id="cart-send-wa"
                data-tooltip-content="Send order via WhatsApp"
                onClick={onSendOrder}
                className="w-full cursor-pointer rounded-md bg-moss-green-200 px-4 py-3 font-medium text-white-water hover:bg-moss-green-100 transition-colors"
              >
                Send order via WhatsApp
              </button>
            </div>
          ) : null}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export function CartNavButton() {
  const { openCart, itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative cursor-pointer rounded-md p-2 text-black-sand hover:bg-moss-green-200/30"
      aria-label="Open shopping cart"
    >
      <ShoppingBagIcon className="size-6" />
      {itemCount > 0 ? (
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-moss-green-200 px-1 text-xs font-bold text-white-water">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null}
    </button>
  );
}
