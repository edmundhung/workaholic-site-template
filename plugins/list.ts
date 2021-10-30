import * as plugin from '@workaholic/core/dist/plugins/plugin-list';

export function setupBuild() {
  const build = plugin.setupBuild();

  return {
    ...build,
    async derive(entries) {
      const listEntries = await build.derive(entries);
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
