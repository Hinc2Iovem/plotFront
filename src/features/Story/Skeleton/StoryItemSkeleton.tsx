export default function StoryItemSkeleton() {
  return (
    <article className="flex flex-col gap-[1rem] w-full rounded-md shadow-sm bg-white h-[30rem]">
      <div className="shadow-md rounded-md h-[50%] w-[100%]"></div>
      <div className="flex flex-col gap-[.5rem] p-[1rem]">
        <h3 className="text-[1.8rem] m-0 p-0 shadow-md rounded-md w-[15rem] h-[3rem]"></h3>
        <h4 className="text-[1.3rem] shadow-md rounded-md w-[90%] h-[2.5rem]"></h4>
      </div>
      <p className="text-[1.2rem] self-end p-[1rem] mt-auto shadow-md rounded-md w-[8rem] h-[2rem] mb-[1rem] mr-[1rem]"></p>
    </article>
  );
}
