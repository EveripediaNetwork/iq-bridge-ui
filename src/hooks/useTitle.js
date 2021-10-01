import { useEffect } from "react";

export default function useTitle(title, append = true) {
  const defaultTitle = "IQ Dashboard | ";
  useEffect(() => {
    const prevTitle = document.title;
    document.title = append ? defaultTitle + title : title;
    return () => {
      document.title = prevTitle;
    };
  });
}
