import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../providers/AuthProvider"
import axios from "axios"
import BidTableRow from "../components/BidTableRow"
import toast from "react-hot-toast"

const MyBids = () => {
  const { user } = useContext(AuthContext)
  const [bids, setBids] = useState([])

  const fetchAllBids = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/bids/${user?.email}`, {
        withCredentials: true
      })
      setBids(data)
    } catch (error) {
      console.log("Something went wrong!!!")
      toast.error("Failed to fetch bids")
    }
  }

  useEffect(() => {
    if (user?.email) fetchAllBids()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email])

  const handleStatusChange = async (bidId, previousStatus, currentStatus) => {
    if (previousStatus !== 'In progress') return console.log("Not Allowed!")

    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/bid-status-update/${bidId}`,
        { status: currentStatus }
      )

      if (data.modifiedCount > 0) {
        toast.success("Status updated successfully")
        await fetchAllBids()
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
          My Active Bids
        </h2>
        <span className='px-4 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full'>
          {bids.length} Bid{bids.length !== 1 && 's'}
        </span>
      </div>

      {/* Table */}
      <div className='overflow-x-auto shadow-lg rounded-xl'>
        <table className='min-w-full divide-y divide-gray-200 bg-white rounded-xl'>
          <thead className='bg-indigo-50'>
            <tr>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Title</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Deadline</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Price</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Category</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Status</th>
              <th className='px-6 py-3 text-left text-gray-600 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {bids.map(bid => (
              <BidTableRow
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

export default MyBids
