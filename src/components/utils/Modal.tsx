import { Dispatch, ReactNode, SetStateAction } from "react";
import ReactModal from "react-modal";
import { useSpring, animated } from "react-spring";
import { backgroundColors } from "./utils";

export interface ModalBasicProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface ModalProps extends ModalBasicProps {
  bgcolor?: backgroundColors;
  children: ReactNode;
  overlay?: boolean;
  fullChildren?: boolean;
}

export default function Modal(props: ModalProps) {
  const {
    isModalOpen,
    setIsModalOpen,
    bgcolor = "bg-background-0",
    children,
    overlay = true,
    fullChildren = false,
  } = props;

  const modalAnimation = useSpring({
    transform: isModalOpen ? "translateY(0%)" : "translateY(200%)",
  });

  const modalStyle = {
    overlay: {
      backgroundColor: overlay ? "#00000099" : "transparent",
      zIndex: 1000,
    },
  };

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
        {fullChildren ? (
          children
        ) : (
          <div
            className={`${bgcolor} flex flex-col w-[90vw] xs:w-[450px] gap-6 border-[3px] shadow-layout border-black rounded-3xl items-center justify-center`}
          >
            <div className="flex flex-col h-full w-full py-10 items-center justify-around">
              {children}
            </div>
          </div>
        )}
      </animated.div>
    </ReactModal>
  );
}
