import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AllPossibleSearchTypes = "command" | "choiceOption" | "conditionVariation" | "ifVariation";

type SearchItemTypes = {
  commandName: string;
  topologyBlockId: string;
  text: string;
  id: string;
  type: AllPossibleSearchTypes;
};

type SearchTypes = {
  storyId: string;
  items: SearchItemTypes[];
};

// When commands have variety of attributes to be searched upon, we just put them all inside text attribute,
// example: command character, beside text has emotion and characterName, they all will be put inside text as a divider will be used space

type SearchStoreTypes = {
  results: SearchTypes[];
  getSearchResults: ({ value }: { value: string; storyId: string }) => SearchItemTypes[];
  addItem: ({ item }: { item: SearchItemTypes; storyId: string }) => void;
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
    storyId: string;
  }) => void;
  deleteValue: ({ id }: { id: string; storyId: string }) => void;
};

const useSearch = create<SearchStoreTypes>()(
  devtools(
    (set, get) => ({
      results: [],
      getSearchResults: ({ value, storyId }) => {
        const results = get()
          .results.find((r) => r.storyId === storyId)
          ?.items.filter((r) => r.text?.toLowerCase().includes(value?.toLowerCase()));
        if (results) {
          return results;
        } else {
          return [];
        }
      },
      addItem: ({ item, storyId }) => {
        const story = get().results.find((r) => r.storyId === storyId);
        if (story) {
          if (!story.items.find((r) => r.id === item.id)) {
            set((state) => ({
              results: state.results.map((r) => (r.storyId === storyId ? { ...r, items: [...r.items, item] } : r)),
            }));
          }
        } else {
          set((state) => ({
            results: [...state.results, { storyId, items: [item] }],
          }));
        }
      },
      updateValue: ({ id, type, value, commandName, storyId }) => {
        const story = get().results.find((r) => r.storyId === storyId);
        if (!story) {
          console.error(`Story with ID ${storyId} not found.`);
          return;
        }

        set((state) => ({
          results: state.results.map((r) => ({
            ...r,
            items:
              r.storyId === storyId
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

      deleteValue: ({ id, storyId }) => {
        const story = get().results.find((r) => r.storyId === storyId);
        if (!story) {
          console.error(`Story with ID ${storyId} not found.`);
          return;
        }

        set((state) => ({
          results: state.results.map((r) => ({
            ...r,
            items: r.storyId === storyId ? r.items.filter((ri) => ri.id !== id) : r.items,
          })),
        }));
      },
    }),
    { name: "SearchName", store: "SearchStore" }
  )
);

export default useSearch;
