# backstage-marketplace

Public plugin marketplace for
[Backstage](https://github.com/SEIFSEIF4/backstage): browse plugins,
vote with your GitHub account, and serve the catalog API
(`/api/registry`) that Backstage installs fetch.

Stack: Next.js + Supabase (RLS-enforced votes, GitHub OAuth). No
service-role key anywhere — reads are anon under RLS, votes ride user
JWTs.

Submit a plugin: PR an entry to the registry (see the footer link).
