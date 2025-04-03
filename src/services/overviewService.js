import axios from "axios"
import tokenUtils from "../utils/tokenUtils"
const API_URL = "https://anrepo.onrender.com"

const get_recents = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(`${API_URL}/recents/list`, config)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const getNotifications = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.get(
      `${API_URL}/notifications/view_notifications`,
      config
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const get_requests = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(`${API_URL}/work/requests`, config)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const get_assigned = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(`${API_URL}/work/assigned`, config)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const add_work = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }

  try {
    const response = await axios.post(`${API_URL}/work/add`, formData, config)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const delete_work = async (id) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.delete(`${API_URL}/work/delete/${id}`, config)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const comment_add = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/work/add_comment`,
      formData,
      config
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const status_change = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/work/status_change`,
      formData,
      config
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const getTrash = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(`${API_URL}/trash/dump`, config)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
const restore = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/trash/restore`,
      formData,
      config
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

const bomb = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/trash/delete/`,
      formData,
      config
    )
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export default {
  get_recents,
  getNotifications,
  get_requests,
  get_assigned,
  add_work,
  delete_work,
  comment_add,
  status_change,
  getTrash,
  restore,
  bomb,
}
