import { StarIcon } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppDataContext } from "../context/AppContext";

const timeFormat = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const {imageBaseUrl} = useContext(AppDataContext)

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800/60 rounded-2xl hover:-translate-y-1 transition duration-300">
      <img
        onClick={() => {
          navigate(`/movie/${movie._id}`);
          window.scrollTo(0, 0);
        }}
        src={imageBaseUrl + movie.poster_path}
        alt={movie.title}
        className="rounded-lg h-56 sm:h-82 w-full object-cover object-top cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        • {timeFormat(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-1">
        <button
          onClick={() => {
            navigate(`/movie/${movie._id}`);
            window.scrollTo(0, 0);
          }}
          className="px-3 sm:px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
