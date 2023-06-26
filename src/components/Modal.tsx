import { Dispatch, ReactNode, SetStateAction } from "react";
import ReactModal from "react-modal";
import { useSpring, animated } from "react-spring";

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export default function Modal(props: ModalProps) {
  const { isModalOpen, setIsModalOpen, children } = props;

  const modalAnimation = useSpring({
    transform: isModalOpen ? "translateY(0%)" : "translateY(200%)",
  });

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      className="modal"
      closeTimeoutMS={200}
      style={{
        overlay: { backgroundColor: "#00000099", zIndex: 1000 },
      }}
      id="modal"
    >
      <animated.div style={modalAnimation}>
        <div className="flex flex-col w-[450px] h-[550px] gap-6 bg-background-1 border-[3px] shadow-layout border-black rounded-[2rem] items-center justify-center">
          <div className="flex flex-col h-full w-full py-10 items-center justify-around">
            {children}
          </div>
        </div>
      </animated.div>
    </ReactModal>
  );
}
