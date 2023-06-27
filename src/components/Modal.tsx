import { Dispatch, ReactNode, SetStateAction } from "react";
import ReactModal from "react-modal";
import { useSpring, animated } from "react-spring";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  backgroundColor?: "bg-background-0" | "bg-pink" | "bg-yellow";
  children: ReactNode;
}

const backgroundColorClasses = {
  "bg-background-0": "bg-background-0",
  "bg-pink": "bg-pink",
  "bg-yellow": "bg-yellow",
};

export default function Modal(props: ModalProps) {
  const {
    isModalOpen,
    setIsModalOpen,
    backgroundColor = "bg-background-0",
    children,
  } = props;

  const modalAnimation = useSpring({
    transform: isModalOpen ? "translateY(0%)" : "translateY(200%)",
  });

  const modalStyle = {
    overlay: { backgroundColor: "#00000099", zIndex: 1000 },
  };

  const modalContentClasses = [
    "flex",
    "flex-col",
    "w-[90vw]",
    "h-[80vh]",
    "xs:w-[450px]",
    "xs:h-[550px]",
    "gap-6",
    "border-[3px]",
    "shadow-layout",
    "border-black",
    "rounded-[2rem]",
    "items-center",
    "justify-center",
    backgroundColorClasses[backgroundColor] || "",
  ].join(" ");

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      className="modal"
      closeTimeoutMS={200}
      style={modalStyle}
      id="modal"
    >
      <animated.div style={modalAnimation}>
        <div className={modalContentClasses}>
          <div className="flex flex-col h-full w-full py-10 items-center justify-around">
            {children}
          </div>
        </div>
      </animated.div>
    </ReactModal>
  );
}
