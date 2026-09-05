import React from "react";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CircleCheck,CircleX,} from "lucide-react";
interface ResponseProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Response: React.FC<ResponseProps> = ({ type, message, onClose }) => {
  const isError = type === "error";
  const Icon = !isError ? CircleCheck : CircleX;
  const iconColor = isError ? "text-red-500" : "text-purple-500";
  const textColor = isError ? "text-red-500" : "text-purple-500";
  const buttonColor = isError ? "bg-red-500" : "bg-purple-500";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-2 h-[200px] w-[300px] shadow-xl flex flex-col gap-4 items-center justify-center py-3">
        <Icon className={`size-20 ${iconColor}`} />
        <p className={`text-center font-medium ${textColor}`}>{message}</p>
        <button
          className={`h-12 w-16 text-white rounded-md ${buttonColor} flex items-center justify-center font-semibold`}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Response;
