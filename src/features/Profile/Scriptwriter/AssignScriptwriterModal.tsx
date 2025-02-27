import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import useGetDecodedJWTValues from "../../../hooks/Auth/useGetDecodedJWTValues";
import useGetAllScriptwriters from "../../../hooks/Fetching/Staff/useGetAllScriptwriters";
import useAssignWorker from "../../../hooks/Patching/Story/useAssignWorker";
import "../../Editor/Flowchart/FlowchartStyles.css";

type AssignScriptwriterModalTypes = {
  storyId: string;
};

export default function AssignScriptwriterModal({ storyId }: AssignScriptwriterModalTypes) {
  const { userId } = useGetDecodedJWTValues();

  const { data: allScriptwriters } = useGetAllScriptwriters();

  const assignWorker = useAssignWorker({
    storyId,
    currentUserId: userId || "",
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-text opacity-80 hover:opacity-100 transition-all mt-auto self-end">
        + Сценарист
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-secondary max-h-[250px] overflow-y-auto -translate-x-[20px] | containerScroll">
        <DropdownMenuGroup>
          {allScriptwriters ? (
            allScriptwriters?.map((s) => (
              <DropdownMenuSub key={s._id}>
                <DropdownMenuSubTrigger
                  className={`flex p-[10px] text-text gap-[5px] justify-between w-full items-center rounded-md hover:bg-background transition-all`}
                >
                  <p className="text-[15px] text-text w-full">
                    {s.username.length > 10 ? s.username.substring(0, 10) + "..." : s.username}
                  </p>
                  {s.imgUrl ? <img src={s.imgUrl} alt={s.username} className="w-[30px] rounded-md" /> : null}
                </DropdownMenuSubTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-secondary">
                    <DropdownMenuItem
                      onClick={() => {
                        assignWorker.mutate({ staffId: s._id });
                      }}
                    >
                      Назначить
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))
          ) : (
            <DropdownMenuItem>Покамись Пусто</DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
