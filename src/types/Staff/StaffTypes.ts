export type StaffMemberTypes = {
  username: string;
  roles: StaffRoles[];
  _id: string;
  imgUrl?: string;
  amountOfFinishedEpisodes?: number;
};

export type StaffInfoTypes = {
  staffId: string;
  _id: string;
  amountOfFinishedEpisodes: number;
};

export type StaffRoles =
  | "scriptwriter"
  | "translator"
  | "headscriptwriter"
  | "editor";
