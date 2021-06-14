// https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=everipedia

const getTokenHolders = async () => {
  const response = await fetch(
    "https://www.api.bloks.io/tokens?type=tokenHoldersCount&chain=eos&contract=everipediaiq&symbol=IQ"
  );
  const data = await response.text();
  return {
    holders: {
      eos: data
    }
  };
};

const getVolume = async () => {
  // TODO: remove tokens that are in bridges current_supply - bridge per chain
  return {
    volume: {
      eos: 10019699034
    }
  };
};

const getTotals = async () => {
  return {
    totals: {
      eos: 10019699034
    }
  };
};

const getEpData = async () => {
  const response = await fetch(
    "https://api.everipedia.org/v2/stat/site-usage?lang=en"
  );
  const data = await response.json();
  return {
    ep: {
      articles: data.total_article_count[0].num_articles,
      editors: data.total_editors,
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
      twitter: 2,
      reddit: data.data.subscribers
    }
  };
};

export { getTokenHolders, getVolume, getTotals, getEpData, getSocialData };
