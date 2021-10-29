---
title: How it works
order: 2
---

# How it works?

Workaholic makes it a 3-steps process in managing your KV data.

## 1. Build

The core of Workaholic handles files similar to an object store. It reads the files inside a specific directory recursively until no more file is found, with `key` being the relative path and `value` being the content of the corresponding file.

By adding plugins, you can apply different `transform` logic, such as parsing the markdown file into HTML and populating metadata from the front matter, or introduce `derive` logic such as generating an index that includes all entries' metadata for a particular directory.

This is done in a single command call:

```sh
workaholic generate ./entries.json
```

The final result will be written as a JSON file which can be picked up in the later steps.

## 2. Query

This project provides a built-in query client for accessing your data with a simple signature:

```ts

interface CreateQuery {
  (kvNamespace: KVNamespace, enhancers?: QueryEnhancer[]): Query;
}

interface Query<Payload = any, Options = Record<string, any>> {
  (namespace: string, path: string, options?: Options): Payload;
}
```

By default, all files parsed are saved in the `data` namespace. For example, if you have a markdown file with file path being `./contents/articles/hello-world.md`, you should be able to retrieve its content and metadata by `query('data', 'articles/hello-world.md')`, assuming `contents` being the source directory in the configuration.

By adding `QueryEnhancer` generated from the plugin, you can extend its functionality by registering a new namespace with the corresponding handlers. For details, please checks the [Plugins](./plugins) section.

To facilitate local testing, Workaholic also provides a little helper which persist your kv data on miniflare for you:

```sh
workaholic preview ./entries.json
```

The project doesn't stop here by just providing you with a query client. It goes 1 step further with a built-in worker script that you can publish as an API service. If you run:

```sh
workaholic build ./worker.js
```

It will generate a worker script in the service-worker format with all plugins set up for you based on the configurations. Just like a normal worker script, it can be consumed by miniflare and tested locally.

This API service translates the request URL to a query using a simple pattern `/:namespace/:path?option=value`.

With the example above, when it receives a `GET /data/articles/hello-world.md` HTTP request, the service will reply with a status 200 response serving the content and metadata in `application/json` format.

## 3. Publish

As `Wrangler`'s built-in `kv:bulk put` command does not support `metadata` yet, workaholic provides a replacement:

```sh
workaholic publish ./entries.json
```

This command will look up the corresponding kv namespace configuration from `wrangler.toml`
