'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  InformationCircleIcon,
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

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
  updateLineQuantity: (lineId: string, quantity: number) => void;
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

  const updateLineQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((prev) => prev.filter((l) => l.id !== lineId));
      return;
    }
    setLines((prev) =>
      prev.map((line) => (line.id === lineId ? { ...line, quantity } : line)),
    );
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
      updateLineQuantity,
      removeLine,
      clearCart,
      itemCount,
    }),
    [lines, isOpen, openCart, closeCart, addToCart, updateLineQuantity, removeLine, clearCart, itemCount],
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
        onUpdateQuantity={updateLineQuantity}
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
  onUpdateQuantity,
  onSendOrder,
}: {
  isOpen: boolean;
  onClose: () => void;
  lines: CartLine[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onSendOrder: () => void;
}) {
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [draftQuantity, setDraftQuantity] = useState('');

  const totalIdr = lines.reduce((s, l) => s + l.unitPriceIdr * l.quantity, 0);
  const totalStr = totalIdr.toLocaleString('en-US', { maximumFractionDigits: 0 });

  function startEditing(line: CartLine) {
    setEditingLineId(line.id);
    setDraftQuantity(String(line.quantity));
  }

  function stopEditing() {
    setEditingLineId(null);
    setDraftQuantity('');
  }

  function commitQuantity(line: CartLine) {
    const next = Number.parseInt(draftQuantity, 10);
    if (Number.isFinite(next) && next > 0) {
      onUpdateQuantity(line.id, next);
    }
    stopEditing();
  }

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
              className="cursor-pointer rounded-md p-2 text-black-sand hover:bg-moss-green-200/20"
              aria-label="Close cart"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <div
            className="mx-4 mt-3 flex gap-2 rounded-md border border-dawn-rays-200/60 bg-dawn-rays-300 px-3 py-2.5 text-sm text-black-sand"
            role="status"
          >
            <InformationCircleIcon
              className="size-5 shrink-0 text-dawn-rays-100"
              aria-hidden
            />
            <p>We only deliver in the Yeh Sumbul/Medewi area.</p>
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
                      <p className="mt-1 text-sm">
                        {editingLineId === line.id ? (
                          <span className="inline-flex items-center gap-1">
                            <span>x</span>
                            <input
                              type="number"
                              min={1}
                              value={draftQuantity}
                              onChange={(event) => setDraftQuantity(event.target.value)}
                              onBlur={() => commitQuantity(line)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  event.preventDefault();
                                  commitQuantity(line);
                                } else if (event.key === 'Escape') {
                                  event.preventDefault();
                                  stopEditing();
                                }
                              }}
                              className="w-12 rounded border border-moss-green-300/50 bg-white-water px-1 py-0.5 text-center text-sm font-medium text-black-sand outline-none"
                              aria-label={`Quantity of ${line.name}`}
                              autoFocus
                            />
                            <span>{`· IDR ${formatPriceNumberAsK(line.unitPriceIdr * line.quantity)}`}</span>
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditing(line)}
                              className="cursor-pointer font-medium text-black-sand underline decoration-dotted underline-offset-2"
                              aria-label={`Edit quantity of ${line.name}`}
                            >
                              x{line.quantity}
                            </button>
                            {` · IDR ${formatPriceNumberAsK(line.unitPriceIdr * line.quantity)}`}
                          </>
                        )}
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
                className="cta before:bg-moss-green-100 w-full cursor-pointer justify-center rounded-md bg-moss-green-200 px-4 py-3 font-medium text-white-water"
              >
                <span className="z-10">Send order via WhatsApp</span>
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
