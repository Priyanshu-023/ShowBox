import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BlurCircle from "./BlurCircle";

const DateSelect = ({ dateTime, id }) => {
  const dates = Object.keys(dateTime);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const onBookHandler = () => {
    if (!selected) {
      return toast("Please select a date");
    }
    navigate(`/movie/${id}/${selected}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10 p-5 md:p-8 mt-12 md:mt-20 bg-primary/10 border border-primary/20 rounded-lg">
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle top="100px" right="0px" />

      <div className="w-full md:w-auto min-w-0">
        <p className="text-lg font-semibold">Choose Date</p>

        <div className="flex items-center gap-2 md:gap-4 mt-5">
          <ChevronLeftIcon className="w-6 h-6 shrink-0 text-gray-400 cursor-pointer" />

          <div className="flex gap-3 md:gap-4 min-w-0 overflow-x-auto py-1">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelected(date)}
                className={`flex flex-col items-center justify-center shrink-0 h-16 w-16 rounded-lg border transition cursor-pointer ${
                  selected === date
                    ? "bg-primary text-white border-primary"
                    : "border-gray-600 text-gray-300 hover:border-primary/70"
                }`}
              >
                <span className="text-xs uppercase">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
                <span className="text-lg font-semibold">
                  {new Date(date).getDate()}
                </span>
              </button>
            ))}
          </div>

          <ChevronRightIcon className="w-6 h-6 shrink-0 text-gray-400 cursor-pointer" />
        </div>
      </div>

      <button
        onClick={onBookHandler}
        className="px-8 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
      >
        Book Now
      </button>
    </div>
  );
};

export default DateSelect;
