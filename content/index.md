---
title: Workaholic
order: 1
---

# Workaholic

Workaholic is a toolkit for managing your files as Worker KV entry. It is...

- **Extensible** - Customisation possible with plugins
- **Batteries-included** - Built-in plugins provided for common usages
- **No code solution** - Ship your data as an API without the need to write a worker

## Why?

I was building a blog on Cloudflare Workers and I wanna have a way to streamline the process in parsing my markdown files with additional processing together with the ability to preview them using miniflare and uploading them to Worker KV.

## Is it production-ready?

No. This project started as a very simple script. But eventually turned into an over-engineered solution with a much wider scope. It is experimental and probably buggy at the moment. But I wish this demo can give you an idea of what it is capable of for now.

## How is it different from serving assets files directly?

There are two main reasons you might want to use workaholic:

1. Preprocessing: Instead of re-processing the files every time on the server or client, the plugin system allows you to preprocess it once and save the result directly in Worker KV.
2. Indexing: The KV `List` API is rather limited on how you can query entries and also relatively costly compared to the `Get` call. Workaholic enables you a simpler setup on building your own index which you can retrieve with a single `Get`.

## Known issues

- The tool does not take into account the max entry size (25MB) at the moment.
- For plugins with custom `setupQuery` logic, it might fail if it imports any node packages, eg. `fs` / `path`.
