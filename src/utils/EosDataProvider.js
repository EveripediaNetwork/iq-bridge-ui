import { asset } from "eos-common";

const getUserTokenBalance = async (ual) => {
  if (!ual.activeUser) {
    return null;
  }

  const response = await ual.activeUser.rpc.get_currency_balance(
    "everipediaiq",
    ual.activeUser.accountName,
    "IQ"
  );

  return response.length > 0 ? asset(response[0]) : null;
};

const convertTokensTx = async (quantity, ethAddress, ual) => {
  const result = await ual.activeUser.signTransaction({
    actions: [
      {
        account: "everipediaiq",
        name: "transfer",
        authorization: [
          {
            actor: ual.activeUser.accountName,
            permission: "active",
          },
        ],
        data: {
          from: ual.activeUser.accountName,
          to: "xeth.ptokens",
          quantity,
          memo: ethAddress,
        },
      },
    ],
  });
  return result;
};

export { convertTokensTx, getUserTokenBalance };
