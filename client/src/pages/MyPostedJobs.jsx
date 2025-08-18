import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../providers/AuthProvider'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import useAxiosSecure from '../hooks/useAxiosSecure'

const MyPostedJobs = () => {
  const axiosSecure = useAxiosSecure()
  const { user } = useContext(AuthContext)
  const [jobs, setJobs] = useState([])

  const fetchAllJobs = async () => {
    try {
      const { data } = await axiosSecure.get(`/jobs/${user?.email}`)
      setJobs(data)
    } catch (error) {
      console.log("Something went wrong!!!")
    }
  }

  useEffect(() => {
    if (user?.email) fetchAllJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email])

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/job/${id}`) // use secure axios instance
      toast.success("Job post deleted successfully.")
      fetchAllJobs()
    } catch (error) {
      console.log("Something went wrong!!!")
      toast.error(error.message)
    }
  }

  const modernToast = (id) => {
    toast(
      (t) => (
        <div className='flex flex-col md:flex-row md:items-center gap-3'>
          <p>Are you <b>sure</b> you want to delete?</p>
          <div className='flex gap-2'>
            <button
              className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors'
              onClick={() => {
                toast.dismiss(t.id)
                handleDelete(id)
              }}
            >
              Yes
            </button>
            <button
              className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors'
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      )
    )
  }

  return (
    <section className='container px-4 mx-auto pt-12'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
          <h2 className='text-2xl font-bold text-indigo-700'>My Active Job Posts</h2>

          {/* Total jobs badge */}
          <span className='px-4 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full'>
            {jobs.length} Job{jobs.length !== 1 && 's'}
          </span>
        </div>
      </div>

      <div className='overflow-x-auto shadow-lg rounded-xl'>
        <table className='min-w-full bg-white border border-gray-200 rounded-xl shadow-md'>
          <thead className='bg-indigo-50'>
            <tr>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Title</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Deadline</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Price Range</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Category</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Description</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {jobs.map(job => (
              <tr key={job._id} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 text-gray-700 whitespace-nowrap'>{job.title}</td>
                <td className='px-6 py-4 text-gray-500 whitespace-nowrap'>{format(new Date(job.date), 'P')}</td>
                <td className='px-6 py-4 text-gray-500 whitespace-nowrap'>${job.min_price} - ${job.max_price}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${job.category === 'Web Development' && 'bg-blue-100 text-blue-600'}
                    ${job.category === 'Digital Marketing' && 'bg-green-100 text-green-600'}
                    ${job.category === 'Graphics Design' && 'bg-orange-100 text-orange-600'}
                  `}>
                    {job.category}
                  </span>
                </td>
                <td className='px-6 py-4 text-gray-500 whitespace-nowrap'>{job.description?.substring(0, 30)}...</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex gap-4'>
                    <button
                      onClick={() => modernToast(job._id)}
                      className='text-red-500 hover:text-red-600 transition-colors'
                      title='Delete Job'
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-5 h-5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21a48.108 48.108 0 00-3.478-.397M4.772 5.79a2.25 2.25 0 012.244-2.077h7.872a2.25 2.25 0 012.244 2.077L19.74 9H4.772z' />
                      </svg>
                    </button>
                    <Link
                      to={`/update/${job._id}`}
                      className='text-yellow-500 hover:text-yellow-600 transition-colors'
                      title='Edit Job'
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-5 h-5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z' />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MyPostedJobs
