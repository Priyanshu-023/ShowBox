import { useState } from "react"
import { dummyTrailers } from "../assets/assets"
import ReactPlayer from "react-player"
import BlurCircle from "./BlurCircle"
import { PlayCircleIcon } from "lucide-react"

const TrailerSection = () => {

  const [trailer, setTrailer] = useState(dummyTrailers[1]);

  return (
    <div className='px-6 py-20 overflow-hidden'>
      <p className='text-gray-300 font-bold text-lg max-w-240 mx-auto'>Trailers</p>

      <div className='relative mt-6 mx-auto w-full max-w-240 aspect-video'>
        <BlurCircle top='-100px' right='0px'/>
        <ReactPlayer src={trailer.videoUrl} controls={false} width="100%" height="100%"/>
      </div>

      <div className='grid grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto'>
        {dummyTrailers.map((item) => (
          <div
            key={item.videoUrl}
            className='relative group cursor-pointer'
            onClick={() => setTrailer(item)}
          >
            <img
              src={item.image}
              alt="trailer"
              className={`rounded-lg w-full h-full object-cover brightness-75 transition group-hover:brightness-100 ${trailer.videoUrl === item.videoUrl ? 'brightness-100' : ''}`}
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className='absolute top-1/2 left-1/2 w-5 h-5 md:w-8 md:h-8 -translate-x-1/2 -translate-y-1/2 text-white'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection
