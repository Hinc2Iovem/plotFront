export type RelationTypes = {
  _id: string;
  relationValue: number;
  characterId: string;
};

type RelationSignTypes = "-" | "+";

export type RelationCommandTypes = {
  _id: string;
  plotFieldCommandId: string;
  sign?: RelationSignTypes;
  relationValue?: number;
  characterId?: string;
};
