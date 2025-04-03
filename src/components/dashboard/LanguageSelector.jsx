import React, { useState } from "react"
import { FaGlobe } from "react-icons/fa" // Importing the globe icon from React Icons

const LanguageSelector = () => {
  const [showTranslate, setShowTranslate] = useState(false)

  const toggleLanguageDropdown = () => {
    setShowTranslate(!showTranslate)
    // const languageDropDwn = document.querySelector(
    //   ".skiptranslate.goog-te-gadget"
    // )
    // languageDropDwn.style.display = "none"
    // const languageDropDwn2 = document.querySelector(".goog-te-gadget")
    // languageDropDwn2.style.display = "none"
  }

  return (
    <div className="relative">
      {/* Language Icon Button */}
      <button
        onClick={toggleLanguageDropdown}
        className="text-xl p-2 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <FaGlobe size={24} /> {/* Using FaGlobe icon from React Icons */}
      </button>

      {/* Google Translate Element */}
      <div
        id="google_translate_element"
        className={`absolute top-10 right-0 z-10 ${
          showTranslate ? "" : "hidden"
        }`}
      ></div>
    </div>
  )
}

export default LanguageSelector
