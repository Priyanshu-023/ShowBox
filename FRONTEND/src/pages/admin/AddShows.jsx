import { useContext, useEffect, useState } from "react";
import { CalendarIcon, CheckIcon, StarIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import BlurCircle from "../../components/BlurCircle";
import { AppDataContext } from "../../context/AppContext";

const formatVotes = (count) =>
  count >= 1000 ? (count / 1000).toFixed(1) + "k" : count;

const AddShows = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPrice, setShowPrice] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [addingShow, setAddingShow] = useState(false);

  const {axios, getToken , user, imageBaseUrl } = useContext(AppDataContext)

  const fetchNowPlayingMovies = async()=>{
    try {
      const {data} = await axios.get('/api/show/now-playing',{
        headers : {Authorization : `Bearer ${await getToken()}`}
      })
      if(data.success){
        setNowPlayingMovies(data.movies)
      }
    } catch (error) {
      console.error('Error Fetching Movies',error)
    }
  }

  useEffect(()=>{
    if(user){
      fetchNowPlayingMovies();
    }  
  },[user])


  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (times.includes(time)) return prev;
      return { ...prev, [date]: [...times, time] };
    });
    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filtered = prev[date].filter((t) => t !== time);
      const updated = { ...prev };
      if (filtered.length === 0) delete updated[date];
      else updated[date] = filtered;
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!selectedMovie) return toast.error("Please select a movie");
    if (!showPrice) return toast.error("Please enter show price");
    if (Object.keys(dateTimeSelection).length === 0)
      return toast.error("Please select at least one show time");

    try {
      setAddingShow(true);

      const showsInput = [];

      for (const date in dateTimeSelection) {
        const time = dateTimeSelection[date];

        const oneEntry = {
          date: date,
          time: time,
        };

        showsInput.push(oneEntry);
      }

      const payload = {
        movieId: selectedMovie,
        showsInput: showsInput,
        showPrice: showPrice,
      };

      const { data } = await axios.post("/api/show/add-show", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Show added successfully");
        setSelectedMovie(null);
        setShowPrice("");
        setDateTimeSelection({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    }

    setAddingShow(false);
  };

  return (
    <div className="relative">
      <BlurCircle top="-100px" left="0px" />
      <BlurCircle top="100px" right="0px" />

      <h1 className="text-lg font-medium">
        Add <span className="text-primary underline">Shows</span>
      </h1>

      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      <div className="flex gap-5 mt-4 overflow-x-auto pt-4 pb-4 pl-2">
        {nowPlayingMovies.map((movie) => {
          const isSelected = selectedMovie === movie.id;
          return (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(isSelected ? null : movie.id)}
              className={`group relative shrink-0 w-44 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:z-10 ${
                selectedMovie && !isSelected ? "opacity-40" : "opacity-100"
              }`}
            >
              <div
                className={`relative rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/30 group-hover:ring-white/20 ${
                  isSelected ? "outline-3 outline-offset-2 outline-primary" : ""
                }`}
              >
                <img
                  src={`${imageBaseUrl}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-44 h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary rounded-md p-1 shadow-lg">
                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}

                <div className="absolute bottom-2 inset-x-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-xs font-medium">
                    <StarIcon className="w-3.5 h-3.5 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow">
                    {formatVotes(movie.vote_count)} Votes
                  </span>
                </div>
              </div>
              <p className="mt-2.5 text-sm font-semibold truncate group-hover:text-primary transition-colors duration-200">
                {movie.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {movie.release_date}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="text-lg font-medium">Show Price</p>
        <div className="inline-flex items-center gap-2 mt-2 border border-gray-600 rounded-md px-3 py-2">
          <span className="text-gray-400">$</span>
          <input
            type="number"
            min={0}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>
      </div>

      <div className="mt-8">
        <p className="text-lg font-medium">Select Date and Time</p>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-2 border border-gray-600 rounded-md pl-3 pr-2 py-2 focus-within:border-primary transition-colors">
            <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              className="outline-none text-sm bg-transparent scheme-dark"
            />
          </div>
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary hover:bg-primary-dull transition rounded-md px-4 py-2 text-sm font-medium cursor-pointer"
          >
            Add Time
          </button>
        </div>

        {Object.keys(dateTimeSelection).length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-300">
              Selected Date-Time
            </p>
            <div className="mt-2 space-y-3">
              {Object.entries(dateTimeSelection).map(([date, times]) => (
                <div key={date}>
                  <p className="text-sm font-semibold">{date}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {times.map((time) => (
                      <div
                        key={time}
                        className="flex items-center gap-1.5 border border-primary/40 bg-primary/10 text-primary rounded-md pl-3 pr-1.5 py-1 text-sm"
                      >
                        <span>{time}</span>
                        <button
                          onClick={() => handleRemoveTime(date, time)}
                          className="hover:bg-primary/20 rounded p-0.5 transition-colors cursor-pointer"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit} disabled={addingShow}
        className="mt-8 bg-primary hover:bg-primary-dull transition rounded-md px-8 py-2.5 font-medium cursor-pointer"
      >
        Add Show
      </button>
    </div>
  );
};

export default AddShows;
