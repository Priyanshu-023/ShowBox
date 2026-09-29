import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useContext } from "react";
import { AppDataContext } from "../context/AppContext";

const Movies = () => {
  const {shows} = useContext(AppDataContext)
  return (
    <div className="relative px-6 md:px-16 xl:px-36 pt-30 pb-20 min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium mb-8">Now Showing</h1>

      {shows.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">No movies available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {shows.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
