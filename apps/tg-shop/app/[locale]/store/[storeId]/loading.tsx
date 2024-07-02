import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoadingPage() {
  return (
    <div className={"min-h-[80vh] m-auto bg-telegram-bg-color"}>
      <AiOutlineLoading3Quarters
        className={
          "animate-spin w-16 h-16 mx-auto text-telegram-button-color mt-64"
        }
      />
    </div>
  );
}
