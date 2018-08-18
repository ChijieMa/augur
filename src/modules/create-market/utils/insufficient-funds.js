import { createBigNumber } from "utils/create-big-number";

import { formatEther, formatRep } from "utils/format-number";

export default function insufficientFunds(
  validityBond,
  gasCost,
  designatedReportNoShowReputationBond,
  availableEth,
  availableRep
) {
  let insufficientFundsString = "";

  const BNvalidityBond = createBigNumber(
    formatEther(validityBond).fullPrecision
  );
  const BNgasCost = createBigNumber(formatEther(gasCost).fullPrecision);
  const BNtotalEthCost = BNvalidityBond.plus(BNgasCost);
  const insufficientEth = createBigNumber(availableEth).lt(BNtotalEthCost);

  const BNdesignatedReportNoShowReputationBond = createBigNumber(
    formatRep(designatedReportNoShowReputationBond).fullPrecision
  );
  const insufficientRep = createBigNumber(availableRep).lt(
    BNdesignatedReportNoShowReputationBond
  );

  if (insufficientEth && insufficientRep) {
    insufficientFundsString = "ETH and REP";
  } else if (insufficientEth) {
    insufficientFundsString = "ETH";
  } else if (insufficientRep) {
    insufficientFundsString = "REP";
  }

  return insufficientFundsString;
}
