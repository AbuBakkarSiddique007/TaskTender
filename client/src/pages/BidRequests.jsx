import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../providers/AuthProvider"
import BidRequestsTableRow from "../components/BidRequestsTableRow"
import toast from 'react-hot-toast'

const BidRequests = () => {
  const { user } = useContext(AuthContext)
  const [bidsJob, setBidsJobs] = useState([])

  useEffect(() => {
    fetchAllBidsReq()
    setBidsJobs(bidsJob)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])


  const fetchAllBidsReq = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/bids/${user?.email}?buyer=true`,
        {
          withCredentials: true
        }
      )
      setBidsJobs(data)
      console.log("data", data);

    } catch (error) {
      console.log(error.message);
    }
  }

  const handleStatusChange = async (bidId, previousStatus, currentStatus) => {
    console.table({ bidId, previousStatus, currentStatus })

    // Validation
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
        { status: currentStatus } // Changed from currentStatus to status
      )

      console.log("Status updated:", data)

      if (data.modifiedCount > 0) {
        toast.success("Status updated successfully")
        // Refresh the list
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
      <div className='flex items-center gap-x-3'>
        <h2 className='text-lg font-medium text-gray-800 '>Bid Requests</h2>

        <span className='px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full '>
          {bidsJob.length} Requests
        </span>
      </div>

      <div className='flex flex-col mt-6'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden border border-gray-200  md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <div className='flex items-center gap-x-3'>
                        <span>Title</span>
                      </div>
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <div className='flex items-center gap-x-3'>
                        <span>Email</span>
                      </div>
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <span>Deadline</span>
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <button className='flex items-center gap-x-2'>
                        <span>Price</span>
                      </button>
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      Category
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      Status
                    </th>

                    <th className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200 '>

                  {bidsJob.map(bid => <BidRequestsTableRow
                    handleStatusChange={handleStatusChange}
                    key={bid._id}
                    bid={bid} >
                  </BidRequestsTableRow>)}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BidRequests
