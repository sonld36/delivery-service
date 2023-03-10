import { pageTitle } from "@Common/const";
import { useState, useEffect } from "react";
import { matchPath } from "react-router-dom";
export const useDebounce = (value: any, milliSeconds: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedValue(value),
      milliSeconds || 1000
    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, milliSeconds]);

  return debouncedValue;
};

export const usePageTitle = (pathName: string) => {
  const currentPageTitle = Object.keys(pageTitle).find((key) => {
    if (matchPath(key, pathName)) {
      return true;
    }

    return false;
  });

  return pageTitle[currentPageTitle ? currentPageTitle : "wrong"];
};
