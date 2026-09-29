import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircleIcon, StarIcon, HeartIcon } from "lucide-react";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { AppDataContext } from "../context/AppContext";

const timeFormat = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState({})
  const dateSelectRef = useRef(null);

  const {axios, shows,imageBaseUrl,getToken,user,favoriteMovies,fetchFavoriteMovies} = useContext(AppDataContext)

  const getShow = async()=>{
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if(data.success){
        setShow(data.dateTime)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getShow()
  },[id])


  const handlefavorite = async()=>{
    try {
      if(!user){
        return toast.error("Please login to proceed")
      }
      const {data} = await axios.post('/api/user/update-favorites', {movieId : id},
        {headers : {Authorization : `Bearer ${await getToken()}`}}
      )
      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const movie = shows.find((show) => show._id === id);

  if (!movie) {
    return <Loading />;
  }

  return (
    <div className="relative px-6 md:px-16 xl:px-36 pt-30 pb-20 min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />

      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={imageBaseUrl + movie.poster_path}
          alt={movie.title}
          className="rounded-xl h-104 w-70 shrink-0 mx-auto md:mx-0 object-cover"
        />

        <div className="flex flex-col gap-3 max-w-xl">
          <p className="text-primary uppercase tracking-wide text-sm font-medium">
            ENGLISH
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold">{movie.title}</h1>

          <div className="flex items-center gap-1 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 leading-relaxed mt-2">
            {movie.overview}
          </p>

          <p className="text-gray-300 mt-2">
            {timeFormat(movie.runtime)} •{" "}
            {movie.genres.map((genre) => genre.name).join(", ")} •{" "}
            {new Date(movie.release_date).getFullYear()}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button className="flex items-center gap-2 px-6 py-3 text-sm bg-gray-800 hover:bg-gray-800/70 transition rounded-full font-medium cursor-pointer">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <button
              onClick={() =>
                dateSelectRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="flex items-center gap-2 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
            >
              Buy Tickets
            </button>

            <button
              onClick={handlefavorite}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-800 hover:bg-gray-800/70 transition cursor-pointer"
            >
              <HeartIcon
                className={`w-5 h-5 ${
                  favoriteMovies.find((fav) => fav._id === id)
                    ? "fill-primary text-primary"
                    : "text-gray-300"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <p className="text-lg font-medium mt-12 md:mt-20">Your Favorite Cast</p>

      <div className="flex items-start gap-4 mt-8 overflow-x-auto">
        {movie.casts.slice(0, 12).map((cast, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center shrink-0 w-24"
          >
            <img
              src={imageBaseUrl + cast.profile_path}
              alt={cast.name}
              className="rounded-full h-20 w-20 object-cover"
            />
            <p className="text-sm text-gray-300 mt-2 truncate w-full">
              {cast.name}
            </p>
          </div>
        ))}
      </div>

      <div ref={dateSelectRef}>
        <DateSelect dateTime={show} id={movie._id} />
      </div>

      <p className="text-lg font-medium mt-12 md:mt-20">You May Also Like</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
        {shows
          .filter((show) => show._id !== movie._id)
          .slice(0, 4)
          .map((show) => (
            <MovieCard movie={show} key={show._id} />
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

export default MovieDetails;
