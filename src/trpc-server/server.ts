import { createCaller, createTRPCContext } from "@/app/trpc";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */


const _headers = cache(async () => headers())
const createContext = cache(async () => {
  const heads = new Headers(await _headers());
  heads.set("x-trpc-source", "rsc");
  heads.set("portal", "user");
  return createTRPCContext({
    // session: await auth(),
    headers: heads,
  });
});

export const api = createCaller(createContext as any);
