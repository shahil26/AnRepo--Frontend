import axios from "axios"
import tokenUtils from "../utils/tokenUtils"
const API_URL = "https://anrepo.onrender.com"

const listImages = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(`${API_URL}/images/list`, config)
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "Failed to fetch images",
    }
  }
}

const uploadImage = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }

  try {
    console.log("Uploading image...")
    const response = await axios.post(`${API_URL}/images/add`, formData, config)
    console.log(response)
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "Failed to upload image",
    }
  }
}

export default {
  listImages,
  uploadImage,
}
