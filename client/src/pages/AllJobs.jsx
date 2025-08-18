import { useState, useEffect } from 'react'
import JobCard from '../components/JobCard'
import useAxiosSecure from '../hooks/useAxiosSecure'

const AllJobs = () => {
  const axiosSecure = useAxiosSecure()

  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const { data } = await axiosSecure.get(
          `/all-jobs?filter=${filter}&search=${search}&sort=${sort}`
        )
        setJobs(data)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      }
    }

    fetchAllJobs()
  }, [filter, search, sort])

  const handleReset = () => {
    setFilter('')
    setSearch('')
    setSort('')
  }

  return (
    <section className='container px-6 py-10 mx-auto min-h-[calc(100vh-306px)] flex flex-col gap-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-center items-center gap-6 mb-8'>
        <h2 className='text-3xl md:text-4xl font-extrabold text-indigo-700 text-center'>
          Explore Exciting Job Opportunities
        </h2>
        <span className='px-5 py-2 text-sm md:text-base font-semibold text-indigo-600 bg-indigo-100 rounded-full shadow'>
          {jobs.length} Job{jobs.length !== 1 && 's'}
        </span>
      </div>

      {/* Filters & Search */}
      <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
        {/* Category Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='border p-3 rounded-lg text-gray-700 focus:ring focus:ring-indigo-300 focus:border-indigo-400'
        >
          <option value=''>Filter By Category</option>
          <option value='Web Development'>Web Development</option>
          <option value='Graphics Design'>Graphics Design</option>
          <option value='Digital Marketing'>Digital Marketing</option>
        </select>

        {/* Search */}
        <div className='flex border rounded-lg overflow-hidden focus-within:ring focus-within:ring-indigo-300 focus-within:border-indigo-400'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by Job Title'
            className='px-4 py-2 text-gray-700 outline-none focus:placeholder-transparent'
          />
          <button className='px-4 py-2 bg-gray-700 text-white rounded-r-md hover:bg-gray-600 transition-colors'>
            Search
          </button>
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className='border p-3 rounded-lg text-gray-700 focus:ring focus:ring-indigo-300 focus:border-indigo-400'
        >
          <option value=''>Sort By Deadline</option>
          <option value='dsc'>Descending Order</option>
          <option value='asc'>Ascending Order</option>
        </select>

        {/* Reset */}
        <button
          onClick={handleReset}
          className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
        >
          Reset
        </button>
      </div>

      {/* Jobs Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-6'>
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </section>
  )
}

export default AllJobs
