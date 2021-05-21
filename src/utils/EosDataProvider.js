import { asset } from "eos-common";
import { everipediaIqContract } from "../config";

const getUserTokenBalance = async ual => {
  if (!ual.activeUser) {
    return null;
  }

  const response = await ual.activeUser.rpc.get_currency_balance(
    everipediaIqContract,
    ual.activeUser.accountName,
    "IQ"
  );

  return response.length > 0 ? asset(response[0]) : null;
};

const getPriceInfo = (assetToGive, assetToReceive, pair) => {
  const price =
    parseFloat(assetToReceive.toString().split(" ")[0]) /
    parseFloat(assetToGive.toString().split(" ")[0]);
  const spotPrice = pair.to.amount / pair.from.amount;
  const priceImpact = Math.abs(
    parseFloat(
      ((1 - (price * (1 + pair.fee / 10000)) / spotPrice) * 100).toFixed(2)
    )
  );
  const token1 = `1 ${assetToGive.symbol.code().toString()}`;
  const token2 = `${price.toFixed(4)} ${assetToReceive.symbol
    .code()
    .toString()}`;

  return {
    price,
    spotPrice,
    priceImpact,
    rate: `${token1} Per ${token2}`
  };
};

const convertTokensTx = async (quantity, ethAddress, ual) => {
  return ual.activeUser.signTransaction(
    {
      actions: [
        {
          account: everipediaIqContract,
          name: "transfer",
          authorization: [
            {
              actor: ual.activeUser.accountName,
              permission: "active"
            }
          ],
          data: {
            from: ual.activeUser.accountName,
            to: "xeth.ptokens",
            quantity,
            memo: ethAddress
          }
        }
      ]
    },
    {
      broadcast: true,
      expireSeconds: 300
    }
  );
};

export { convertTokensTx, getUserTokenBalance, getPriceInfo };
