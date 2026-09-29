import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import BlurCircle from "./BlurCircle";
import { useContext } from "react";
import { AppDataContext } from "../context/AppContext";

const FeatureSection = () => {
  const navigate = useNavigate();
  const {shows} = useContext(AppDataContext)

  return (
    <div className="relative px-6 md:px-16 xl:px-36 mt-20 md:mt-30">
      <BlurCircle top="-100px" right="64px" />

      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">Now Showing</p>
        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-1 text-lg font-medium text-gray-300 hover:text-white transition cursor-pointer"
        >
          View All
          <ArrowRight className="w-4.5 h-4.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
        {shows.slice(0, 4).map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate("/movies");
            window.scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default FeatureSection;
