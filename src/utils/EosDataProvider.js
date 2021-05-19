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

export { convertTokensTx, getUserTokenBalance };
