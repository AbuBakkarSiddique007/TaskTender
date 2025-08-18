// import { useContext } from 'react'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// import { AuthContext } from '../providers/AuthProvider'
// import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../hooks/useAxiosSecure'

const AddJob = () => {
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()
  const [startDate, setStartDate] = useState(new Date())
  const navigate = useNavigate()

  // Tanstack query
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (jobData) => {
      return await axiosSecure.post(`/add-job`, jobData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
    onError: (error) => {
      console.error("Error adding job:", error)
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const title = form.job_title.value.trim()
    const description = form.description.value.trim()
    const max_price = form.max_price.value
    const min_price = form.min_price.value
    const category = form.category.value
    const email = form.email.value
    const date = startDate

    // Validation
    if (!title || !description || !min_price || !max_price || !category) {
      toast.error("Please fill all required fields.")
      return
    }

    if (Number(min_price) > Number(max_price)) {
      toast.error("Minimum price cannot be greater than Maximum price.")
      return
    }

    const formData = {
      buyer: {
        email,
        name: user?.displayName,
        photo: user?.photoURL
      },
      title,
      description,
      max_price,
      min_price,
      category,
      date,
      bid_count: 0,
    }

    try {
      await mutateAsync(formData)
      form.reset()
      setStartDate(new Date())
      toast.success("Job added successfully!")
      navigate('/my-posted-jobs')
    } catch (error) {
      console.log("Error", error)
      toast.error(error.message)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12 bg-gradient-to-b from-gray-100 to-gray-50'>
      <section className='p-6 md:p-10 mx-auto bg-white rounded-2xl shadow-xl w-full max-w-4xl'>
        <h2 className='text-3xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
          Create Your Dream Job Post
        </h2>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 font-medium' htmlFor='job_title'>
                Job Title
              </label>
              <input
                id='job_title'
                name='job_title'
                type='text'
                placeholder='Enter job title'
                className='block w-full px-4 py-3 mt-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200 focus:outline-none transition duration-300'
              />
            </div>

            <div>
              <label className='text-gray-700 font-medium' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                id='emailAddress'
                type='email'
                name='email'

                // For Default email
                defaultValue={user.email}
                disabled={true}
                className='block w-full px-4 py-3 mt-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl shadow-sm cursor-not-allowed focus:outline-none'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-gray-700 font-medium'>Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className='border border-gray-300 p-2 rounded-xl shadow-sm w-full focus:outline-none focus:ring focus:ring-purple-200 transition duration-300'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-gray-700 font-medium' htmlFor='category'>
                Category
              </label>
              <select
                name='category'
                id='category'
                className='border border-gray-300 p-2 rounded-xl shadow-sm focus:outline-none focus:ring focus:ring-purple-200 transition duration-300'
              >
                <option value='Web Development'>Web Development</option>
                <option value='Graphics Design'>Graphics Design</option>
                <option value='Digital Marketing'>Digital Marketing</option>
              </select>
            </div>

            <div>
              <label className='text-gray-700 font-medium' htmlFor='min_price'>
                Minimum Price
              </label>
              <input
                id='min_price'
                name='min_price'
                type='number'
                placeholder='Enter minimum price'
                className='block w-full px-4 py-3 mt-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200 focus:outline-none transition duration-300'
              />
            </div>

            <div>
              <label className='text-gray-700 font-medium' htmlFor='max_price'>
                Maximum Price
              </label>
              <input
                id='max_price'
                name='max_price'
                type='number'
                placeholder='Enter maximum price'
                className='block w-full px-4 py-3 mt-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200 focus:outline-none transition duration-300'
              />
            </div>
          </div>

          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 font-medium' htmlFor='description'>
              Description
            </label>
            <textarea
              className='block w-full px-4 py-3 mt-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200 focus:outline-none transition duration-300'
              name='description'
              id='description'
              placeholder='Enter job description'
            ></textarea>
          </div>

          <div className='flex justify-end mt-6'>
            <button className='disabled:cursor-not-allowed px-8 py-3 text-white font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring focus:ring-purple-200 transition duration-300'>
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddJob
