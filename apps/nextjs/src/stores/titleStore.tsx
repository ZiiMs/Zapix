import { create } from "zustand";

import { createSelectors } from "~/utils/api";

interface ITitleStore {
  title: string;
  setTitle: (title: string) => void;
}

const useTitleStoreBase = create<ITitleStore>((set) => ({
  title: "Friends",
  setTitle: (title) => set({ title }),
}));

export default createSelectors(useTitleStoreBase);
