export type PlotFieldTypes = {
  _id: string;
  plotfieldCommandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
};

export type PlotFieldCommandIfTypes = {
  _id: string;
  topologyBlockId: string;
  isElse: boolean;
  plotfieldCommandIfId?: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
};

export type AllPossiblePlotFieldComamndsTypes =
  | "achievement"
  | "ambient"
  | "background"
  | "blank"
  | "call"
  | "choice"
  | "if"
  | "else"
  | "end"
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

export type OmittedCommandNames = Exclude<AllPossiblePlotFieldComamndsTypes, "end" | "else">;
