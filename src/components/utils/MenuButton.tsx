import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { backgroundColors } from "./utils";

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  imgsrc?: string;
  bgcolor?: backgroundColors;
  padding?: boolean;
  children?: ReactNode;
}

export default function MenuButton(props: MenuButtonProps) {
  const { title, imgsrc, bgcolor = "bg-white", children } = props;

  return (
    <button
      className={`${bgcolor} flex w-full h-24 items-center justify-between p-4 px-5 border-[3px] rounded-3xl border-black shadow-layout hover:shadow-layouthover hover:translate-y-2 transition-all`}
      {...props}
    >
      <p
        className={clsx("uppercase text-start font-space text-2xl font-bold", {
          "text-white": bgcolor === "bg-pink",
        })}
      >
        {title}
      </p>
      {imgsrc && (
        <img src={imgsrc} alt="img of button" className="hidden xs:block" />
      )}
      {children}
    </button>
  );
}
