import { allTrainerConfigs } from "#app/data/balance/trainer-configs/all-trainer-configs";
import { TrainerType } from "#enums/trainer-type";
import { VoucherType } from "#enums/voucher-type";
import i18next from "i18next";
import { achvs } from "./achv";
import { Voucher, vouchers } from "./voucher";

export function initVouchers() {
  for (const achv of [achvs.CLASSIC_VICTORY]) {
    const voucherType =
      achv.score >= 150
        ? VoucherType.GOLDEN
        : achv.score >= 100
          ? VoucherType.PREMIUM
          : achv.score >= 75
            ? VoucherType.PLUS
            : VoucherType.REGULAR;
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
