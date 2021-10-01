import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useIframeSync = () => {
  const location = useLocation();

  useEffect(() => {
    const handleIncomingMessage = e => {
      const originURL = new URL(e.origin);
      if (
        (originURL.hostname === "localhost" &&
          (process.env.NODE_ENV ?? "development") === "development") ||
        originURL.hostname.endsWith("everipedia.org")
      ) {
        let eventData;
        try {
          const parsedData = JSON.parse(
            Buffer.from(e?.data, "base64").toString()
          );
          if (parsedData?.eventType?.length) {
            eventData = parsedData;
          }
        } catch (err) {
          // console.error(`Unable to parse event data: ${JSON.stringify(e)}`);
        }

        if (eventData) {
          //   console.log(
          //     `[IQ] Got message | ${JSON.stringify(eventData, null, 1)}`
          //   );

          if (eventData.eventType === "userInfo") {
            console.log(`Got logged in user ${eventData.value.accountName}`);
          }
        }
      }
    };

    window.addEventListener("message", handleIncomingMessage, false);
    return () => window.removeEventListener("message", handleIncomingMessage);
  }, []);

  useEffect(() => {
    window.top.postMessage(
      `${Buffer.from(
        JSON.stringify({
          eventType: "nav",
          value: {
            path: location.pathname,
            query: location.search,
            pageTitle: document.title
          }
        })
      ).toString("base64")}`,
      "*"
    );
  }, [location]);
};
