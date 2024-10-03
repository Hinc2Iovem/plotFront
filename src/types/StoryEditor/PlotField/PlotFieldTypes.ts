export type PlotFieldTypes = {
  _id: string;
  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
};

export type PlotFieldCommandIfTypes = {
  _id: string;
  topologyBlockId: string;
  isElse: boolean;
  commandIfId?: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
};

export type AllPossiblePlotFieldComamndsTypes =
  | "achievement"
  | "ambient"
  | "background"
  | "call"
  | "choice"
  | "if"
  | "condition"
  | "cutscene"
  | "effect"
  | "getitem"
  | "key"
  | "move"
  | "music"
  | "name"
  | "say"
  | "sound"
  | "suit"
  | "wait"
  | "comment"
  | "wardrobe";
