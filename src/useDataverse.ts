import { useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient } from "@truenorth-it/dataverse-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function useDataverse() {
  const { getAccessTokenSilently } = useAuth0();

  const client = useMemo(
    () =>
      createClient({
        baseUrl,
        getToken: () => getAccessTokenSilently(),
      }),
    [getAccessTokenSilently]
  );

  return client;
}
