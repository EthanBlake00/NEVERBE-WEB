"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeFromBag } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces/BagItem";
import { IoTrashOutline } from "react-icons/io5";

interface BagItemCardProps {
  item: BagItem;
  compact?: boolean;
  showRemove?: boolean;
}

const BagItemCard = ({
  item,
  compact = false,
  showRemove = false,
}: BagItemCardProps) => {
  const dispatch: AppDispatch = useDispatch();
  const totalPrice = item.price * item.quantity;
  const netPrice = totalPrice - item.discount;

  if (compact) {
    return (
      <div className="flex gap-3 py-2.5 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.06))] last:border-none group items-center">
        <div className="relative w-14 h-14 bg-[#0A0A0A] shrink-0 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] overflow-hidden p-0.5">
          <Image
            src={item.thumbnail || ""}
            alt={item.name}
            fill
            className="object-cover rounded-xl"
          />
          {item.isComboItem && (
            <span className="absolute top-0.5 left-0.5 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-[7px] font-black px-1 rounded-sm uppercase tracking-tighter">
              Bundle
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black uppercase truncate text-[var(--v2-text-primary,#F5F5F5)] m-0">
            {item.name}
          </p>
          <p className="text-[10px] text-[var(--v2-text-secondary,#A0A0A0)] uppercase font-bold tracking-wider m-0">
            Size: {item.size} · Qty: {item.quantity}
          </p>
          {item.isComboItem && item.comboName && (
            <p className="text-[9px] text-[var(--v2-accent,#2EE66A)] uppercase font-extrabold tracking-widest mt-0.5 m-0">
              {item.comboName}
            </p>
          )}
          {showRemove && (
            <button
              onClick={() => dispatch(removeFromBag(item))}
              className="text-[var(--v2-text-muted,#666666)] hover:text-rose-400 transition-colors border-none bg-transparent cursor-pointer p-0 mt-1 flex items-center gap-1"
            >
              <IoTrashOutline size={14} />
            </button>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-black text-[var(--v2-accent,#2EE66A)] m-0">
            LKR {netPrice.toLocaleString()}
          </p>
          {item.discount > 0 && (
            <p className="text-[9px] text-[var(--v2-text-muted,#666666)] line-through m-0">
              LKR {totalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full v2-glass p-3.5 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all">
      {/* Image Container */}
      <div className="relative w-20 h-20 bg-[#0A0A0A] shrink-0 rounded-2xl overflow-hidden border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] p-0.5">
        <Image
          src={item.thumbnail || ""}
          alt={item.name}
          fill
          className="object-cover rounded-xl"
        />
        {item.isComboItem && (
          <span className="absolute top-1 left-1 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-[8px] font-black px-1.5 py-0.5 uppercase tracking-wider rounded-sm">
            Bundle
          </span>
        )}
      </div>

      {/* Details Column */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-black text-xs uppercase leading-tight line-clamp-2 text-[var(--v2-text-primary,#F5F5F5)] m-0">
              {item.name}
            </h3>
            <div className="text-right shrink-0">
              {item.discount > 0 ? (
                <>
                  <p className="font-black text-xs text-[var(--v2-accent,#2EE66A)] m-0">
                    LKR {netPrice.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-[var(--v2-text-muted,#666666)] line-through m-0">
                    LKR {totalPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="font-black text-xs text-[var(--v2-accent,#2EE66A)] m-0">
                  LKR {totalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-1">
            {item.isComboItem && item.comboName && (
              <span className="inline-block bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/20 text-[9px] font-black px-1.5 py-0.5 mb-1 tracking-wider uppercase rounded-md">
                {item.comboName}
              </span>
            )}
            <div className="text-[10px] text-[var(--v2-text-secondary,#A0A0A0)] font-extrabold uppercase space-y-0.5">
              {item.variantName && (
                <p className="m-0 text-[var(--v2-text-secondary,#A0A0A0)]">{item.variantName}</p>
              )}
              <p className="m-0">
                Size: <span className="text-[var(--v2-text-primary,#F5F5F5)]">{item.size}</span> · Qty:{" "}
                <span className="text-[var(--v2-text-primary,#F5F5F5)]">{item.quantity}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-start mt-2">
          <button
            onClick={() => dispatch(removeFromBag(item))}
            className="text-[var(--v2-text-muted,#666666)] hover:text-rose-400 transition-colors border-none bg-transparent cursor-pointer p-0 flex items-center justify-center"
            aria-label="Remove item from bag"
          >
            <IoTrashOutline size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BagItemCard;
