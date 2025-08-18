/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { format } from "date-fns";

const JobCard = ({ job }) => {
  const {
    title,
    description,
    max_price,
    min_price,
    category,
    date,
    _id,
    bid_count,
    buyer
  } = job || {}

  return (
    <Link
      to={`/job/${_id}`}
      className="w-full max-w-sm px-5 py-5 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
    >

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          Deadline: {format(new Date(date), 'P')}
        </span>
        <span className="px-3 py-1 text-xs text-blue-900 uppercase bg-blue-200 rounded-full font-semibold">
          {category}
        </span>
      </div>

      <div className="mt-3">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
          {title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 line-clamp-2">
          {description?.substring(0, 100)}...
        </p>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm sm:text-base font-medium text-gray-700">
          Range: <span className="text-green-600">${min_price} - ${max_price}</span>
        </p>
        <p className="text-sm sm:text-base font-medium text-gray-700">
          Total Bids: <span className="text-indigo-600">{bid_count}</span>
        </p>
      </div>

      <div className="mt-4 border-t pt-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-base">
          {buyer?.photo ? (
            <img
              referrerPolicy='no-referrer'
              src={buyer.photo}
              alt={buyer?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            buyer?.name?.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate w-44">
            {buyer?.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 truncate w-44">
            {buyer?.email}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default JobCard
