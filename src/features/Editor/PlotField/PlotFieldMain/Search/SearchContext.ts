import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AllPossibleSearchTypes = "command" | "choiceOption" | "conditionVariation" | "ifVariation";

export type SearchItemTypes = {
  commandName: string;
  topologyBlockId: string;
  text: string;
  id: string;
  type: AllPossibleSearchTypes;
};

type SearchTypes = {
  episodeId: string;
  items: SearchItemTypes[];
};

// When commands have variety of attributes to be searched upon, we just put them all inside text attribute,
// example: command character, beside text has emotion and characterName, they all will be put inside text as a divider will be used space

type SearchStoreTypes = {
  results: SearchTypes[];
  getSearchResults: ({ value, episodeId }: { value: string; episodeId: string }) => SearchItemTypes[];
  addItem: ({ item }: { item: SearchItemTypes; episodeId: string }) => void;
  updateValue: ({
    value,
    id,
    type,
    commandName,
  }: {
    value: string;
    id: string;
    type: AllPossibleSearchTypes;
    commandName: string;
    episodeId: string;
  }) => void;
  deleteValue: ({ id }: { id: string; episodeId: string }) => void;
};

const useSearch = create<SearchStoreTypes>()(
  devtools(
    (set, get) => ({
      results: [],
      getSearchResults: ({ value = "", episodeId }) => {
        if (!value?.trim().length) {
          return [];
        }
        const results = get()
          .results.find((r) => r.episodeId === episodeId)
          ?.items.filter(
            (r) =>
              r.text?.toLowerCase().includes(value?.toLowerCase()) ||
              r.commandName?.toLowerCase().includes(value?.toLowerCase())
          );
        if (results) {
          return results;
        } else {
          return [];
        }
      },
      addItem: ({ item, episodeId }) => {
        const episode = get().results.find((r) => r.episodeId === episodeId);
        if (episode) {
          if (!episode.items.find((r) => r.id === item.id)) {
            set((state) => ({
              results: state.results.map((r) => (r.episodeId === episodeId ? { ...r, items: [...r.items, item] } : r)),
            }));
          }
        } else {
          set((state) => ({
            results: [...state.results, { episodeId, items: [item] }],
          }));
        }
      },
      updateValue: ({ id, type, value, commandName, episodeId }) => {
        if (value === null || value === "null") {
          return;
        }
        const episode = get().results.find((r) => r.episodeId === episodeId);
        if (!episode) {
          console.error(`Episode with ID ${episodeId} not found.`);
          return;
        }

        set((state) => ({
          results: state.results.map((r) => ({
            ...r,
            items:
              r.episodeId === episodeId
                ? r.items.map((ri) =>
                    ri.id === id
                      ? {
                          ...ri,
                          type,
                          commandName,
                          text: value,
                        }
                      : ri
                  )
                : r.items,
          })),
        }));
      },

      deleteValue: ({ id, episodeId }) => {
        const episode = get().results.find((r) => r.episodeId === episodeId);
        if (!episode) {
          console.error(`Episode with ID ${episodeId} not found.`);
          return;
        }

        set((state) => ({
          results: state.results.map((r) => ({
            ...r,
            items: r.episodeId === episodeId ? r.items.filter((ri) => ri.id !== id) : r.items,
          })),
        }));
      },
    }),
    { name: "SearchName", store: "SearchStore" }
  )
);

export default useSearch;
