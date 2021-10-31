---
title: Plugins
order: 3
---

# Plugins

Before going through this section, it is strongly recommended to read the [Concepts](../concepts) first.

## Built-in plugins

Workaholic provides a list of [plugins](https://github.com/edmundhung/workaholic/tree/main/src/plugins) by default, they include

- `plugin-frontmatter`: Parse the front matter as `metadata` with the markdown content kept as `value`
- `plugin-json`: Extract the **metadata** property from the JSON data as `metadata` and keep the rest in `value`
- `plugin-toml`: Parse TOML as JSON and process the JSON data as `plugin-json`
- `plugin-yaml`: Similar to `plugin-toml`, parsing YAML as JSON instead
- `plugin-list`: Create an index per directory. Provide a query option `includeSubfolders` to control if  entries in subfolders are counted or not (default: `false`)

These plugins will be set only if you have no `plugins` configured in the `wrangler.toml`. When you start adding any other custom plugin, you are required to specify all plugins including the above plugins yourself. You can specify the built-in plugins with `source = @workaholic/core/src/plugins/:plugin-name`.

## Plugin interface

> The plugin interface is highly experimental. The current design is made as a proof of concept. A redesign is very likely to happen before a stable release.

The current plugin design supports 2 different hooks: `setupBuild` for customising the build process and `setupQuery` for extending the query functionality.

### setupBuild

```ts
interface SetupBuild {
  (options?: Record<string, any>) => Build;
}

interface Build {
  namespace?: string;
  transform?: (entry: Entry) => Entry | Promise<Entry>;
  index?: (entries: Entry[]) => Entry[] | Promise<Entry[]>;
}

interface Entry {
  key: string;
  value: string;
  metadata?: Record<string, any>;
}
```

The first pipeline you can setup is `transform`. This is the first customisation you can apply on each entry right after the core finish parsing the source directory. It could be used for parsing specific file formats into JSON and deriving additional data.

The second pipeline you can implement is `index`. It will be called only after the `transform` phase is completed. It is mainly used for indexing. Be aware that this function should return new entries only. You are also required to provide a `namespace` in the Build object when using this pipeline. This namespace will be used to prefix the key of each entry returned.

> It feels strange here, I know. The idea was trying to limit the namespace a plugin can be applied to and avoid polluting other namespaces. This is one of the key reasons why I wanna redesign the plugin

Both pipelines supports asynchronous processing and are applied following the order of the plugins that are defined in the configuration.

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

The `setupQuery` function is much simpler compared to `setupBuild`. The QueryEnhancer is an object describing the namespace it should be registered on with a corresponding handler.

## Further plugin ideas

To give you more ideas on what you can achieve with the plugin system, here is a list of plugins that could be built:

- **plugin-search**: Enable searching for entries based on keywords or tags by generating indexes with the `index` pipeline and a query enhancer registered in the `search` namespace.

- **plugin-image**: Enable image resizing or format conversion based on configuration by implementing custom `transform` logic

- **plugin-git**: Derive additional metadata from git, such as last modified date, author etc, using the `transform` pipeline.

- **plugin-link-preview**: Generate link preview by prefetching the URL and saving its metadata within the `transform` pipeline.
