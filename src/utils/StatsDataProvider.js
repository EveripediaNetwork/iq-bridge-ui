const getTokenHolders = async () => {
  const response = await fetch(
    "https://www.api.bloks.io/tokens?type=tokenHoldersCount&chain=eos&contract=everipediaiq&symbol=IQ"
  );
  const data = await response.text();

  const response2 = await fetch(
    "https://ethplorer.io/service/service.php?data=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9&page=chart%3Dcandlestick"
  );
  const data2 = await response2.json();
  return {
    holders: {
      eos: data,
      eth: data2.token.holdersCount
    }
  };
};

const getVolume = async () => {
  const response = await fetch(
    "https://ethplorer.io/service/service.php?data=0x579cea1889991f68acc35ff5c3dd0621ff29b0c9&page=chart%3Dcandlestick"
  );
  const data = await response.json();
  // TODO: remove tokens that are in bridges current_supply - bridge per chain
  return {
    volume: {
      eos: 10019699034,
      eth: parseInt(data.token.totalSupply, 10) / 10e17
    }
  };
};

const getHiIQ = async () => {
  const response = await fetch(
    "https://ethplorer.io/service/service.php?data=0x1bf5457ecaa14ff63cc89efd560e251e814e16ba&page=chart%3Dcandlestick"
  );
  const data = await response.json();
  // TODO: remove tokens that are in bridges current_supply - bridge per chain
  return {
    hiiq: {
      holders: data.token?.holdersCount || 0,
      volume: parseInt(data.token?.totalSupply, 10) / 10e17 || 0
    }
  };
};

const getLPs = async () => {
  const response = await fetch(
    "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2",
    {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6,et;q=0.5,ca;q=0.4",
        "content-type": "application/json"
      },
      body: '{"operationName":"pairs","variables":{"allPairs":["0xd6c783b257e662ca949b441a4fcb08a53fc49914"]},"query":"fragment PairFields on Pair {\\n  id\\n  txCount\\n  token0 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  token1 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  reserve0\\n  reserve1\\n  reserveUSD\\n  totalSupply\\n  trackedReserveETH\\n  reserveETH\\n  volumeUSD\\n  untrackedVolumeUSD\\n  token0Price\\n  token1Price\\n  createdAtTimestamp\\n  __typename\\n}\\n\\nquery pairs($allPairs: [Bytes]!) {\\n  pairs(first: 500, where: {id_in: $allPairs}, orderBy: trackedReserveETH, orderDirection: desc) {\\n    ...PairFields\\n    __typename\\n  }\\n}\\n"}',
      method: "POST"
    }
  );
  const data = await response.json();

  const response2 = await fetch(
    "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06",
    {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-US,en;q=0.9,es;q=0.8,pt;q=0.7,gl;q=0.6,et;q=0.5,ca;q=0.4",
        "content-type": "application/json"
      },
      body: '{"operationName":"pairs","variables":{"allPairs":["0xf63b80af6d52f57b7f1dfb2a857f5e5592d0620f"]},"query":"fragment PairFields on Pair {\\n  id\\n  token0 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  token1 {\\n    id\\n    symbol\\n    name\\n    totalLiquidity\\n    derivedETH\\n    __typename\\n  }\\n  reserve0\\n  reserve1\\n  reserveUSD\\n  totalSupply\\n  trackedReserveETH\\n  reserveETH\\n  volumeUSD\\n  untrackedVolumeUSD\\n  token0Price\\n  token1Price\\n  createdAtTimestamp\\n  __typename\\n}\\n\\nquery pairs($allPairs: [Bytes]!) {\\n  pairs(first: 500, where: {id_in: $allPairs}, orderBy: trackedReserveETH, orderDirection: desc) {\\n    ...PairFields\\n    __typename\\n  }\\n}\\n"}',
      method: "POST"
    }
  );
  const data2 = await response2.json();
  return {
    lp: {
      uniswap: data.data.pairs[0].reserveUSD,
      quickswap: data2.data.pairs[0].reserveUSD
    }
  };
};

const getEpData = async () => {
  const response = await fetch(
    "https://api.everipedia.org/v2/stat/site-usage?lang=en"
  );
  const data = await response.json();
  const response2 = await fetch("https://api.prediqt.com/graphql", {
    headers: {
      accept: "*/*",
      "content-type": "application/json"
    },
    referrer: "https://prediqt.com/",
    body: '{"query":"\\n{\\n  stats_all_time {\\n blockchain_users\\n markets_created\\n }\\n \\n}\\n"}',
    method: "POST"
  });
  const data2 = await response2.json();
  return {
    prediqt: {
      markets: data2.data.stats_all_time.markets_created
    },
    ep: {
      articles: data.total_article_count[0].num_articles,
      edits: data.total_edits,
      views: data.total_pageviews[0].pageviews
    }
  };
};

const getSocialData = async () => {
  const response = await fetch(
    "https://www.reddit.com/r/everipedia/about.json"
  );
  const data = await response.json();
  return {
    social: {
      twitter: 118300,
      reddit: data.data.subscribers
    }
  };
};

export {
  getTokenHolders,
  getVolume,
  getEpData,
  getSocialData,
  getHiIQ,
  getLPs
};
