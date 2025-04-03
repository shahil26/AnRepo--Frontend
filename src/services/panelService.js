import axios from "axios"
import tokenUtils from "../utils/tokenUtils"
const API_URL = "https://anrepo.onrender.com"

const request_access = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.post(
      `${API_URL}/admin/request_access`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const approve_access = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/approve_access`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const disapprove_access = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/disapprove_access`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const add_individual = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.post(
      `${API_URL}/admin/add_individual`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const add_domain = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.post(
      `${API_URL}/admin/add_domain`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const remove_domain = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/remove_domain`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const remove_individual = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/remove_individual`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const list_requests = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
  try {
    const response = await axios.get(`${API_URL}/admin/list_requests`, config)
    return response
  } catch (error) {
    console.log(error)
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const list_approvals = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(`${API_URL}/admin/list_approvals`, config)

    return response.data.data
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const approve = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/approve`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const disapprove = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/disapprove`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const list_publications = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(
      `${API_URL}/admin/list_publications`,
      config
    )
    return response
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const approve_publication = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/approve_publication`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const updateRbacPermissions = async (data) => {
  data = JSON.stringify(data)
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/set_controls`,
      data,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const disapprove_publication = async (formData) => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.put(
      `${API_URL}/admin/disapprove_publication`,
      formData,
      config
    )
    return {
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const fetchRbac = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    // Make the API request
    const response = await axios.get(`${API_URL}/admin/list_controls`, config)

    // Validate and parse the response
    const controlsRaw = response?.data?.data?.[0]?.controls
    if (!controlsRaw) {
      throw new Error("Controls data is missing or invalid.")
    }

    // Parse JSON strictly and validate the resulting object
    let controls
    try {
      controls = JSON.parse(controlsRaw)

      // Optional: Check if the parsed result is indeed an object
      if (
        typeof controls !== "object" ||
        controls === null ||
        Array.isArray(controls)
      ) {
        throw new Error("Parsed controls is not a valid JSON object.")
      }
    } catch (parseError) {
      throw new Error("Failed to parse controls as JSON.")
    }

    // Return the validated and parsed object
    return controls
  } catch (error) {
    console.error("Error fetching or parsing controls:", error)
    throw {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || error.message || "An error occurred",
    }
  }
}

const scrape_publications = async () => {
  const token = tokenUtils.getToken()
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.get(`${API_URL}/scrapper/scraped_data`, config)
    return response
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "An error occurred",
    }
  }
}

const rolemap = {
  admin: "Admin",
  dept_head: "Dept. Head",
  faculty: "Faculty",
  student: "Student",
  financial_officer: "Financial Officer",
  reviewer: "Report Reviewer",
  viewer: "Viewer",
}

const revrolemap = {
  Admin: "admin",
  "Dept. Head": "dept_head",
  Faculty: "faculty",
  Student: "student",
  "Financial Officer": "financial_officer",
  "Report Reviewer": "reviewer",
  Viewer: "viewer",
}

export default {
  request_access,
  approve_access,
  disapprove_access,
  add_individual,
  add_domain,
  remove_domain,
  remove_individual,
  list_requests,
  list_approvals,
  approve,
  disapprove,
  approve_publication,
  disapprove_publication,
  list_publications,
  updateRbacPermissions,
  fetchRbac,
  scrape_publications,
  rolemap,
  revrolemap,
}
