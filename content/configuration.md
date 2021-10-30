---
title: Configuration
order: 4
---

# Configuration

Workaholic reads the configuration from `wrangler.toml` under the `workaholic` key.

> All paths defined should be relative to the directory where `wrangler.toml` is placed

Example from [workaholic-site-template](https://github.com/edmundhung/workaholic-site-template)

```toml
name = "workaholic-site-demo"
type = "javascript"
account_id = "c63d756a160ad09cd9a82553c77e9174"
zone_id = "622ad109259227680bce9543285b50c3"
route = "demo.workaholic.site/*"

[[kv_namespaces]]
binding = "CONTENT"
preview_id = "2a5bc0bcea334efcb92c51892b5a8e3c"
id = "28c5833cb7494566ba868166bddc234b"

[build]
# Optional. Set this up only when you would like to serve the data using the built-in worker
command = "npx workaholic build ./worker.js"

[build.upload]
format = "service-worker"

# Configuration for Workaholic

[workaholic]
## Required. Relative path of the data source directory
source = "content"
## Required. The name of the binding as defined under `kv_namespaces` above
binding = "CONTENT"

[[workaholic.plugins]]
## Required. Relative path of the plugin file
source = "./plugins/list.ts"
## Optional (default: {}). Options passed to the `setupBuild` function
buildOptions = { foo = "bar" }
## Optional (default: {}). Options passed to the `setupQuery` function
queryOptions = { baz = "qux" }

[workaholic.site]
## Optional (default: ""). Include an additional basename to the URL mapping logic for the built-in API worker
## Requests received are forwarded to the origin if the URL does not match the basename
## This is useful especially in combination with Cloudflare Pages
basename = "/api"
```
