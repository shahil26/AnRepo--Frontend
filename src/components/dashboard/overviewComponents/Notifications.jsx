import { useState, useEffect } from "react"
import overviewService from "../../../services/overviewService"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetch() {
    setIsLoading(true)
    try{
      const response = await overviewService.getNotifications();
      setNotifications(response.data.notifications);
    }
    catch(e){
      console.log(e);
    }

    setIsLoading(false)
  }


  useEffect(() => {
    fetch()
  }, [])

  return (
    <div className="w-full h-[calc(100vh-7rem)] border-2 shadow-md rounded-md p-4 overflow-auto bg-white dark:bg-gray-900 dark:border-gray-700 border-gray-400">
      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        Notifications
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={notification.id || index}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:text-white dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {notification.message}
              </p>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>
                  From: <span className="font-medium">{notification.from}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No notifications found
        </div>
      )}
    </div>
  )
}

export default Notifications