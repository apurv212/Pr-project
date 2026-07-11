import { useCallback, useEffect, useState } from "react";

/**
 * Runs an API function and exposes {data, error, isLoading, reload}.
 * Aborts the in-flight request when deps change or the component unmounts, so
 * a slow response can never overwrite fresher state.
 *
 * @param {(options: {signal: AbortSignal}) => Promise<any>} fetcher
 * @param {Array<any>} deps  re-fetch when these change
 *
 * @example
 * const { data, error, isLoading, reload } = useApi(
 *   ({ signal }) => listPosts({ page, signal }),
 *   [page]
 * );
 */
export const useApi = (fetcher, deps = []) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: true,
  });
  const [reloadCount, setReloadCount] = useState(0);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetcher({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ data, error: null, isLoading: false });
      })
      .catch((error) => {
        if (controller.signal.aborted) return; // superseded or unmounted
        setState({ data: null, error, isLoading: false });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  return { ...state, reload };
};
