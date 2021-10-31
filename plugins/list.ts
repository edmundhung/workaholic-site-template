import type { Build, Entry } from '@workaholic/core';
import * as plugin from '@workaholic/core/dist/plugins/plugin-list';

export function setupBuild(): Build {
  const build = plugin.setupBuild();

  return {
    ...build,
    async index(entries: Entry[]): Promise<Entry[]> {
      const listEntries = await build.index(entries);
      const result = listEntries.map(entry => {
        const references = JSON.parse(entry.value);

        return {
          ...entry,
          value: JSON.stringify(references.sort((prev, next) => prev.metadata?.order - next.metadata?.order)),
        };
      });

      return result;
    },
  };
}

export const setupQuery = plugin.setupQuery;
