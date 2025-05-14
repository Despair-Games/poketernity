import { TrainerType } from "#enums/trainer-type";
import { VoucherType } from "#enums/voucher-type";
import { achvs } from "#system/achievements";
import { Voucher, vouchers } from "#system/voucher";
import { allTrainerConfigs } from "#trainer-configs/all-trainer-configs";
import i18next from "i18next";

export function initVouchers() {
  for (const achv of [achvs.CLASSIC_VICTORY]) {
    const voucherType = VoucherType.REGULAR;
    vouchers[achv.id] = new Voucher(voucherType, achv.description);
  }

  const bossTrainerTypes = Object.keys(allTrainerConfigs).filter(
    (tt) =>
      allTrainerConfigs[tt].isBoss
      && allTrainerConfigs[tt].getDerivedType() !== TrainerType.RIVAL
      && allTrainerConfigs[tt].hasVoucher,
  );

  for (const trainerType of bossTrainerTypes) {
    const voucherType = allTrainerConfigs[trainerType].moneyMultiplier < 10 ? VoucherType.PLUS : VoucherType.PREMIUM;
    const key = TrainerType[trainerType];
    let trainerName = allTrainerConfigs[trainerType].name;
    if (
      allTrainerConfigs[trainerType].hasDouble
      && allTrainerConfigs[trainerType].spriteNameLeft
      && allTrainerConfigs[trainerType].spriteNameRight
    ) {
      trainerName = `${allTrainerConfigs[trainerType].name} & ${allTrainerConfigs[trainerType].nameFemale}`;
    }
    const trainer = allTrainerConfigs[trainerType];
    const title = trainer.title ? ` (${trainer.title})` : "";
    vouchers[key] = new Voucher(voucherType, `${i18next.t("voucher:defeatTrainer", { trainerName })} ${title}`);
  }
  const voucherKeys = Object.keys(vouchers);
  for (const k of voucherKeys) {
    vouchers[k].id = k;
  }
}
