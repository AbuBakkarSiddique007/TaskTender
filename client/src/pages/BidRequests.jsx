import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../providers/AuthProvider"
import BidRequestsTableRow from "../components/BidRequestsTableRow"
import toast from 'react-hot-toast'
import useAxiosSecure from "../hooks/useAxiosSecure"

const BidRequests = () => {
  const axiosSecure = useAxiosSecure()
  const { user } = useContext(AuthContext)
  const [bidsJob, setBidsJobs] = useState([])

  useEffect(() => {
    if (user?.email) fetchAllBidsReq()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchAllBidsReq = async () => {
    try {
      const { data } = await axiosSecure.get(`/bids/${user?.email}?buyer=true`)
      setBidsJobs(data)
      console.log("data", data)
    } catch (error) {
      console.log(error.message)
      toast.error("Failed to fetch bid requests")
    }
  }

  const handleStatusChange = async (bidId, previousStatus, currentStatus) => {
    console.table({ bidId, previousStatus, currentStatus })

    if (previousStatus === currentStatus) {
      console.log("Status unchanged")
      toast.warning("Status is the same")
      return
    }

    if (previousStatus === "Completed") {
      console.log("Cannot change completed status")
      toast.error("Cannot modify completed bids")
      return
    }

    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/bid-status-update/${bidId}`,
        { status: currentStatus }
      )

      if (data.modifiedCount > 0) {
        toast.success("Status updated successfully")
        await fetchAllBidsReq()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error.message)
      toast.error("Failed to update status")
    }
  }

  return (
    <section className='container px-4 mx-auto my-12'>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:justify-start md:items-center gap-4 mb-8'>
        <h2 className='text-3xl font-bold text-indigo-700'>
          Incoming Bid Requests
        </h2>
        <span className='px-4 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full'>
          {bidsJob.length} Request{bidsJob.length !== 1 && 's'}
        </span>
      </div>

      {/* Table */}
      <div className='overflow-x-auto shadow-lg rounded-xl'>
        <table className='min-w-full divide-y divide-gray-200 bg-white rounded-xl'>
          <thead className='bg-indigo-50'>
            <tr>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Title</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Email</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Deadline</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Price</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Category</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Status</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {bidsJob.map(bid => (
              <BidRequestsTableRow
                key={bid._id}
                bid={bid}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default BidRequests
