import { handlers } from "@/lib/auth";

// File ini otomatis menangani endpoint: /api/auth/signin, /api/auth/signout,
// /api/auth/session, /api/auth/callback/credentials, dll — semua diatur oleh Auth.js.
export const { GET, POST } = handlers;
