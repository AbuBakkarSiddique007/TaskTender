/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const Slide = ({ image, text }) => {
  return (
    <div
      className="w-full bg-center bg-cover h-[33rem] rounded-lg overflow-hidden shadow-lg"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-b from-black/40 via-black/50 to-black/60">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {text}
          </h1>
          <p className="mt-4 text-gray-200 sm:text-lg md:text-xl drop-shadow-sm">
            Connect with top talents and post your jobs effortlessly
          </p>
          <Link
            to="/add-job"
            className="inline-block px-6 py-3 mt-6 text-sm sm:text-base font-semibold text-white capitalize bg-blue-600 rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform"
          >
            Post Job & Hire Expert
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Slide
