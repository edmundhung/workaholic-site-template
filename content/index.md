---
title: Workaholic
order: 1
---

# Workaholic

Workaholic is a toolkit for manging your files as Worker KV entry. It is...

- **Extensible** - Customisation possible with plugins
- **Batteries-included** - Built-in plugins provided for common usages
- **No code solution** - Ship your data as an API without the need to write a worker

## Why?

I was building a blog on Cloudflare Workers and I wanna have a way to streamline the process in parsing my markdown files with additional processing together with the ability to preview them using miniflare and uploading them to Worker KV.

## Is it production ready?

No. This projects started as a very simple script. But eventually turned into an over-engineered solution with much wider scope. It is experimental and probably buggy at the moment. But I wish this demo can give you an idea what it is capable of for now.

## How is it different from serving assets files directly?

There are two mains reasons you might want to use workaholic:

1. Preprocessing: Instead of re-processing the files everytime on server or client, the plugin system allows you to preprocess it once and save the result directly in Worker KV.
2. Indexing: The KV `List` API is rather limited on how you can query entries and also relatively costly comparing to the `Get` call. Workaholic enables you are simpler setup on building your own index which you can retrieve with a single `Get`.

## Known issues

- The tool does not take into account of the max entry size (25MB) at the moment.
- For plugins with custom `setupQuery` logic, it might fail if it imports any node packages, eg. `fs` / `path`.
