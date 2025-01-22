import i18next from "i18next";
import type { ConditionFn } from "#app/@types/common";
import { AchvTier } from "#enums/achv-tier";
import { VoucherType } from "#enums/voucher-type";

export class Voucher {
  public id: string;
  public voucherType: VoucherType;
  public description: string;

  /** Currently unused */
  private conditionFunc?: ConditionFn;

  constructor(voucherType: VoucherType, description: string, conditionFunc?: ConditionFn) {
    this.description = description;
    this.voucherType = voucherType;
    this.conditionFunc = conditionFunc;
  }

  validate(...args: unknown[]): boolean {
    return !this.conditionFunc || this.conditionFunc(...args);
  }

  public get name(): string {
    return getVoucherTypeName(this.voucherType);
  }

  public get iconImage(): string {
    return getVoucherTypeIcon(this.voucherType);
  }

  getTier(): AchvTier {
    switch (this.voucherType) {
      case VoucherType.REGULAR:
        return AchvTier.COMMON;
      case VoucherType.PLUS:
        return AchvTier.GREAT;
      case VoucherType.PREMIUM:
        return AchvTier.ULTRA;
      case VoucherType.GOLDEN:
        return AchvTier.EPIC;
    }
  }
}

export function getVoucherTypeName(voucherType: VoucherType): string {
  switch (voucherType) {
    case VoucherType.REGULAR:
      return i18next.t("voucher:eggVoucher");
    case VoucherType.PLUS:
      return i18next.t("voucher:eggVoucherPlus");
    case VoucherType.PREMIUM:
      return i18next.t("voucher:eggVoucherPremium");
    case VoucherType.GOLDEN:
      return i18next.t("voucher:eggVoucherGold");
  }
}

export function getVoucherTypeIcon(voucherType: VoucherType): string {
  switch (voucherType) {
    case VoucherType.REGULAR:
      return "coupon";
    case VoucherType.PLUS:
      return "pair_of_tickets";
    case VoucherType.PREMIUM:
      return "mystic_ticket";
    case VoucherType.GOLDEN:
      return "golden_mystic_ticket";
  }
}

export interface Vouchers {
  [key: string]: Voucher;
}

export const vouchers: Vouchers = {};
