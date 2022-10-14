import create from 'zustand';

interface ITitleStore {
  title: string;
  setTitle: (title: string) => void;
}

const useTitleStore = create<ITitleStore>((set) => ({
  title: '',
  setTitle: (title: string) => set({ title }),
}));

export default useTitleStore

