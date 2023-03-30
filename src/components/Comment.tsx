import UserIcon from "./UserIcon";

type Props = {
  children?: React.ReactNode;
  data: PostComment;
  topLevel?: boolean;
};

export default function Comment({ children, data, topLevel }: Props) {
  return (
    <div className={topLevel ? "" : "ml-6 md:ml-8"}>
      <div className="flex my-4">
        <UserIcon className="mr-1 mt-2" />
        <div className="p-4 border border-gray-700 rounded-md flex-1">
          <div>
            <p className="font-semibold">username123</p>
          </div>
          <p className="mt-4">{data.content}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
