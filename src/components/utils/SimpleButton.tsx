import { ButtonHTMLAttributes } from "react";

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export default function SimpleButton(props: SimpleButtonProps) {
  const { title } = props;

  return (
    <button
      className="hidden xs:flex w-full xs:w-44 items-center justify-center uppercase bg-background-0 text-white h-12 font-space font-bold px-12 rounded-full outline outline-[3px] outline-transparent -outline-offset-2 hover:outline-pink hover:outline-offset-4 hover:bg-pink transition-all"
      {...props}
    >
      {title}
    </button>
  );
}
