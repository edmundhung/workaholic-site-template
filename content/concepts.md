---
title: Concepts
order: 2
---

# Concepts

Workaholic makes it a 3-steps process in managing your KV data.

## 1. Build

![Initialise Phase](./flowchart1.png)

The core of Workaholic handles files similar to an object store. It reads files inside a specific directory recursively until no more file is found. It generates an entry for each file, in which `key` is set as the relative file path and `value` is the content of the file.

![Transform Phase](./flowchart2.png)

With plugins, you can apply different `transform` logic, such as parsing the markdown file into HTML and populating metadata from the front matter, or introduce `index` logic such as generating an index that includes all entries' metadata for a particular directory.

![Index Phase](./flowchart3.png)

This is done in a single command call:

```sh
workaholic generate ./entries.json
```

The result will be output as a JSON file which can be picked up in the later steps.

## 2. Publish

As the built-in `kv:bulk put` command from `Wrangler` ignores the `metadata` property in the result JSON, Workaholic provides a replacement:

```sh
workaholic publish ./entries.json
```

This command will look up the corresponding KV namespace configuration from `wrangler.toml`.

## 3. Query

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

By adding `QueryEnhancer` generated from the plugin, you can extend the query client's functionality by registering a new namespace with the corresponding handlers. For details, please checks the [Plugins](../plugins) page.

To facilitate local testing, Workaholic also provides a little helper which persist your KV data on Miniflare for you:

```sh
workaholic preview ./entries.json
```

Additionaly, it provides a built-in worker script that you can publish as an API service.

```sh
workaholic build ./worker.js
```

Running the above command will generate a worker script in the `service-worker` format with all plugins set up for you based on the configurations. Just like a normal worker script, it can be consumed by Miniflare and tested locally.

This API service translates the request URL with the pattern `/:namespace/:path?option=value` to a query.

With the example above, when it receives a `GET /data/articles/hello-world.md` HTTP request, the service will return the content and metadata with response status 200.
