import newLogo from '../assets/images/newLogo.png'
import { NavLink, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { user, logOut } = useAuth()

  return (
    <div className='bg-white shadow-md container px-6 mx-auto py-3'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>

        <div className='flex-1 flex items-center justify-center sm:justify-start'>
          <Link to='/' className='flex gap-3 items-center'>
            <img className='w-auto h-12' src={newLogo} alt='OpportuneX Logo' />
            <span className='font-extrabold text-2xl text-gray-900 hover:text-blue-600 transition-colors'>
              OpportuneX
            </span>
          </Link>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-6'>
          <ul className='flex flex-col sm:flex-row gap-3 sm:gap-6 font-semibold text-lg'>
            <li>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  `transition-colors duration-200 ${isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/jobs'
                className={({ isActive }) =>
                  `transition-colors duration-200 ${isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                All Jobs
              </NavLink>
            </li>

            {!user && (
              <li>
                <NavLink
                  to='/login'
                  className={({ isActive }) =>
                    `px-5 py-2 rounded-lg transition-all duration-200 text-lg text-center block ${isActive
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>

          {user && (
            <div className='dropdown dropdown-end z-50 mt-3 sm:mt-0'>
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-blue-400 transition-all duration-200 mx-auto sm:mx-0'
              >
                <div
                  title={user?.displayName}
                  className='w-11 h-11 rounded-full overflow-hidden border-2 border-gray-300'
                >
                  <img
                    referrerPolicy='no-referrer'
                    alt='User Profile'
                    src={
                      user?.photoURL ||
                      'https://i.ibb.co.com/RGqpdvJL/images.jpg'
                    }
                    className='object-cover w-full h-full'
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-white rounded-xl w-56 border border-gray-200 text-gray-700 text-base font-medium'
              >
                <li>
                  <NavLink
                    to='/add-job'
                    className={({ isActive }) =>
                      `rounded-md transition-colors duration-200 px-3 py-2 ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
                      }`
                    }
                  >
                    Add Job
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/my-posted-jobs'
                    className={({ isActive }) =>
                      `rounded-md transition-colors duration-200 px-3 py-2 ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
                      }`
                    }
                  >
                    My Posted Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/my-bids'
                    className={({ isActive }) =>
                      `rounded-md transition-colors duration-200 px-3 py-2 ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
                      }`
                    }
                  >
                    My Bids
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/bid-requests'
                    className={({ isActive }) =>
                      `rounded-md transition-colors duration-200 px-3 py-2 ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'
                      }`
                    }
                  >
                    Bid Requests
                  </NavLink>
                </li>
                <li className='mt-2'>
                  <button
                    onClick={logOut}
                    className='bg-red-500 text-white w-full py-2 rounded-md hover:bg-red-600 transition-all duration-200 text-base font-semibold'
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
