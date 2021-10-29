---
title: Plugins
order: 3
---

# Plugins

Before going through this section, it is strongly recommended to read the [How it works](./how-it-works) section first.

## Built-in plugins

Workaholic provides a list of [plugins](https://github.com/edmundhung/workaholic/tree/main/src/plugins) by default:

- `plugin-frontmatter`: Parse the front matter as `metadata` with the markdown content kept as `value`
- `plugin-json`: Extract the `metadata` from the JSON data and repack the remaining data in `value`
- `plugin-toml`: Parse TOML as JSON and extract the `metadata` key as `Metadata`, keeping the rest as `value`
- `plugin-yaml`: Similar to `plugin-toml`, parsing YAML as JSON instead
- `plugin-list`: Create a list entry per directory with a query option to include entries in subfolders (default: `false`)

These plugins will be set only if you have no `plugins` configured in the `wrangler.toml`. When you start adding any custom plugin, you are required to specify them yourself by specifying the `source` as **@workaholic/core/src/plugins/:plugin-name**.

## Plugin interface

> The plugin interface is highly experimental. The current design is made as a proof of concept. A redesign is very likely to happen before a stable release.

The current plugin design supports 2 different layers: `setupBuild` for customising the build process and `setupQuery` for extending the query functionality.

### setupBuild

```ts
interface SetupBuild {
  (options?: Record<string, any>) => Build;
}

interface Build {
  namespace?: string;
  transform?: (entry: Entry) => Entry | Promise<Entry>;
  derive?: (entries: Entry[]) => Entry[] | Promise<Entry[]>;
}

interface Entry {
  key: string;
  value: string;
  metadata?: Record<string, any>;
}
```

The first hook provided is `transform`. This is the first customisation you can apply on each entry right after the core finish parsing the source directory. Usage includes parsing specific file formats into JSON and inferring additional data.

The second hook provided is `derive`. It will be called only after the `transform` phase is completed. Usage would be mainly related to indexing. Be aware that this hook should return new entries only. You are also required to provide a `namespace` in the Build object when using this hook. This namespace will be used to prefix the key of each entry returned.

> It feels strange here, I know. The idea was trying to limit the namespace a plugin can be applied to and avoid polluting other namespaces. This is one of the key reasons why I wanna redesign the plugin

Both hooks support async process and are applied in the same order of the plugins defined in the configuration.

### setupQuery

```ts
interface SetupQuery {
  (options?: Record<string, any>) => QueryEnhancer;
}

interface QueryEnhancer<Payload = any> {
  namespace: string;
  handlerFactory: HandlerFactory<Payload>;
}

interface HandlerFactory<Payload = any> {
  (kvNamespace: KVNamespace): Handler<Payload>;
}

interface Handler<Payload = any> {
  (path: string, options: Record<string, any>): Promise<Payload | null>;
}
```

The `setupQuery` function is much simpler compared to `setupBuild`. The QueryEnhancer is just an object describing the namespace it should be registered on with a corresponding handler.

## Plugin ideas

To give you more ideas on what you can achieve with the plugin system, here is a list of plugins that could be built:

- **plugin-search**: Enable searching for entries based on keywords or tags by generating indexes with the `derive` hook and a query enhancer registered in the `search` namespace.

- **plugin-image**: Enable image resizing or format conversion based on configuration by implementing custom `transform` logic

- **plugin-git**: Deriving additional metadata from git, such as last modified date, author etc, using the `transform` hook.

- **plugin-link-preview**: Generating link preview by prefetching the URL and saving its metadata within the `transform` hook.
