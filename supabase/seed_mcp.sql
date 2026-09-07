-- Adds the MCP plugin to the live catalog. Run after 0002_icon_url.sql.
-- Not applied automatically: this project has no migration runner, and the
-- deployment only carries an anon key, which mp_plugins' read-only RLS
-- policy correctly refuses writes from.
insert into public.mp_plugins
  (id, name, description, version, author, "group", repo_url, icon_url)
values (
  'mcp',
  'AI Assistant (MCP)',
  'Let Claude, Cursor, or any MCP client work in this workspace.',
  '0.1.0',
  'Backstage',
  'Advanced',
  'https://github.com/seifelesllamseif/backstage/tree/main/plugins/mcp',
  'https://raw.githubusercontent.com/seifelesllamseif/backstage/main/public/logos/mcp.svg'
)
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  version     = excluded.version,
  repo_url    = excluded.repo_url,
  icon_url    = excluded.icon_url;
