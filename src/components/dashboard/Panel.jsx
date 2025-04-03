/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useMemo } from "react";
import panelService from "../../services/panelService";
import { useSelector } from "react-redux";
import axios from "axios";

const Panel = () => {
  const [accessRequests, setAccessRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessType, setAccessType] = useState("individual");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("grant");
  const [revokeAccessType, setRevokeAccessType] = useState("individual");
  const [revokeEmail, setRevokeEmail] = useState("");
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(true);
  const [approvalType, setApprovalType] = useState("all");
  const [publications, setPublications] = useState([]);
  const [rbacPermissions, setRbacPermissions] = useState({});
  const [hasRbacChanges, setHasRbacChanges] = useState(false);
  const profile = useSelector((state) => state.user);
  const [rbacVisibility, setRbacVisibility] = useState({
    admin: [
      "dept_head",
      "faculty",
      "student",
      "financial_officer",
      "reviewer",
      "viewer",
    ],
    dept_head: ["faculty", "student", "viewer"],
    faculty: ["student", "viewer"],
    financial_officer: ["viewer"],
    reviewer: ["viewer"],
    student: [],
    viewer: [],
  });

  const fetchRbacData = useCallback(async () => {
    try {
      let rbacData = await panelService.fetchRbac();

      if (rbacData) {
        setRbacPermissions(rbacData || {});
      }
    } catch (err) {
      console.error("Failed to fetch RBAC data:", err);
    }
  }, []);

  const getVisibleRbacRoles = useCallback(
    (userRoles) => {
      if (!rbacVisibility) return [];
      let visibleRoles = new Set();
      userRoles.forEach((role) => {
        if (rbacVisibility[role]) {
          rbacVisibility[role].forEach((r) => visibleRoles.add(r));
        }
      });
      return Array.from(visibleRoles);
    },
    [rbacVisibility]
  );

  // Filter RBAC table rows
  const visibleRoles = useMemo(
    () => getVisibleRbacRoles(profile.roles),
    [profile.roles, getVisibleRbacRoles]
  );

  const fetchApprovals = useCallback(async () => {
    setIsLoadingApprovals(true);
    try {
      const response = await panelService.list_approvals();
      console.log(response);
      if (response && response.data && response.data.data) {
        setApprovalRequests(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
    } finally {
      setIsLoadingApprovals(false);
    }
  }, []);

  const fetchAccessRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const requestsData = await panelService.list_requests();
      if (requestsData && requestsData.data && requestsData.data.data) {
        setAccessRequests(requestsData.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPublications = useCallback(async () => {
    setIsLoading(true);
    try {
      await panelService.scrape_publications();
      const response = await panelService.list_publications();
        setPublications([
          {
            _id: "1",
            title: "Research on AI in Healthcare",
            description:
              "This publication discusses the latest advancements in artificial intelligence technologies and their application in healthcare, particularly in diagnostics and patient management.",
            status: "pending", // Default status
          },
          {
            _id: "2",
            title: "Blockchain Technology in Financial Services",
            description:
              "An in-depth analysis of blockchain technology and its transformative impact on the financial services sector, covering decentralized finance (DeFi) and security aspects.",
            status: "pending", // Default status
          },
          {
            _id: "3",
            title: "Quantum Computing: The Future of Technology",
            description:
              "This paper explores the potential of quantum computing in revolutionizing industries, focusing on the technological challenges and breakthroughs in quantum algorithms and hardware.",
            status: "pending", // Default status
          },
          {
            _id: "4",
            title: "Sustainable Urban Development Strategies",
            description:
              "A comprehensive look at urban planning strategies focused on sustainability, including green infrastructure, energy-efficient buildings, and smart city technologies.",
            status: "approved", // Default status
          },
          {
            _id: "5",
            title: "Advancements in Renewable Energy Solutions",
            description:
              "A review of cutting-edge renewable energy technologies, from solar power to wind and hydroelectric solutions, with a focus on their environmental and economic impact.",
            status: "disapproved", // Default status
          }]);
    } catch (error) {
      console.error("Error fetching publications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
    fetchAccessRequests();
    fetchPublications();
    fetchRbacData();
  }, [fetchApprovals, fetchAccessRequests, fetchPublications, fetchRbacData]);

  const handleRequest = useCallback(async (id, action) => {
    try {
      const formData = new FormData();
      formData.append("request_id", id);
      if (action === "accepted") {
        await panelService.approve_access(formData);
      } else {
        await panelService.disapprove_access(formData);
      }
      setAccessRequests((prev) => prev.filter((request) => request._id !== id));
    } catch (err) {
      console.error("Failed to update request:", err);
    }
  }, []);

  const handlePermissionChange = useCallback((role, permission) => {
    setRbacPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission],
      },
    }));
    setHasRbacChanges(true);
  }, []);

  const saveRbacChanges = useCallback(async () => {
    try {
      const stringifiedPermissions = JSON.stringify(rbacPermissions)
      await panelService.updateRbacPermissions(stringifiedPermissions);
      setHasRbacChanges(false);
    } catch (err) {
      console.error("Failed to save RBAC permissions:", err);
    }
  }, [rbacPermissions]);


  const roleCanManage = useMemo(() => {
    if (!rbacVisibility) return {};
    const manage = {};
    for (const role in rbacVisibility) {
      manage[role] = rbacVisibility[role];
    }
    return manage;
  }, [rbacVisibility]);

  const canManageRole = useCallback(
    (currentUserRole, roleToManage) => {
      if (!roleCanManage) return false;
      return roleCanManage[currentUserRole]?.includes(roleToManage) || false;
    },
    [roleCanManage]
  );

const RBACControls = useCallback(({ currentUserRole, rbacPermissions, onPermissionChange, onSaveRbacChanges }) => {
  
    const [localRbacPermissions, setLocalRbacPermissions] = useState({});
    const [hasLocalRbacChanges, setHasLocalRbacChanges] = useState(false);


    useEffect(() => {
      // Sync local state with fetched rbac permissions
      setLocalRbacPermissions(rbacPermissions);
    }, [rbacPermissions]);

    const handlePermissionChange = (role, action) => {
      setLocalRbacPermissions((prev) => ({
        ...prev,
        [role]: {
          ...prev[role],
          [action]: !prev[role][action], // Toggle permission
        },
      }));
      setHasLocalRbacChanges(true);
        
    };

    const saveRbacChanges = useCallback(async () => {
    try {
        onSaveRbacChanges(localRbacPermissions);
        setHasLocalRbacChanges(false);
        } catch (err) {
        console.error("Failed to save RBAC changes:", err);
        }
    }, [localRbacPermissions, onSaveRbacChanges]);



    if (!localRbacPermissions || Object.keys(localRbacPermissions).length === 0) {
      return <div>Loading...</div>;
    }

    // Extract roles and actions
    const roles = Object.keys(localRbacPermissions);
    const allActions = Array.from(
      new Set(
        Object.values(localRbacPermissions).flatMap((permissions) =>
          Object.keys(permissions)
        )
      )
    );

    return (
      <div className="mb-8">
        <div className="flex items-center mb-4 justify-between gap-4">
          <h2 className="text-xl font-bold dark:text-white">RBAC Controls</h2>
          {hasLocalRbacChanges && (
            <button
              onClick={saveRbacChanges}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">Roles / Actions</th>
                {allActions.map((action) => (
                  <th key={action} className="px-4 py-2 capitalize text-center">
                    {action.replace(/([A-Z])/g, " $1").trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => {
                const permissions = localRbacPermissions[role];

                return (
                  <tr key={role} className="border-b dark:border-gray-600">
                    <td className="px-4 py-2 font-medium capitalize text-left">
                      {panelService.rolemap[role] || role}
                    </td>
                    {allActions.map((action) => (
                      <td key={action} className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={permissions[action] || false} // Ensure boolean value
                          onChange={() => handlePermissionChange(role, action)} // Toggle permissions
                          className="w-4 h-4"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }, [panelService.rolemap]);


  const handleGrantAccess = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        if (accessType === "individual") {
          formData.append("email_id", email);
        } else {
          formData.append("domain", email);
        }
        formData.append("role", panelService.rolemap[role]);

        if (accessType === "individual") {
          await panelService.add_individual(formData);
        } else {
          await panelService.add_domain(formData);
        }

        setEmail("");
        setRole("");
      } catch (err) {
        console.error("Failed to grant access:", err);
      }
    },
    [accessType, email, role, panelService.rolemap]
  );

  const handleRevokeAccess = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        if (revokeAccessType === "individual") {
          formData.append("email_id", revokeEmail);
        } else {
          formData.append("domain", revokeEmail);
        }
        formData.append("role", panelService.rolemap[role]);

        if (revokeAccessType === "individual") {
          await panelService.remove_individual(formData);
        } else {
          await panelService.remove_domain(formData);
        }
        setRevokeEmail("");
      } catch (err) {
        console.error("Failed to revoke access:", err);
      }
    },
    [revokeAccessType, revokeEmail, role, panelService.rolemap]
  );

  // Handle publication approval/disapproval
  const handlePublication = useCallback(async (id, action) => {
    try {
      const formData = new FormData();
      formData.append("_id", id);
      const url =
        action === "approved"
          ? await panelService.approve_publication(formData)
          : await panelService.disapprove_publication(formData);

      await axios.put(url);
      // Update the publications list after approval/disapproval
      setPublications((prevPublications) =>
        prevPublications.map((publication) =>
          publication._id === id
            ? { ...publication, approved: action === "approved" }
            : publication
        )
      );
    } catch (error) {
      console.error("Error updating publication status:", error);
    }
  }, []);

  const filteredPublications = useMemo(() => {
    if (activeTab === "approved") {
      return publications.filter(
        (publication) => publication.status === "approved"
      );
    } else if (activeTab === "disapproved") {
      return publications.filter(
        (publication) => publication.status === "disapproved"
      );
    }
    return publications; 
  }, [activeTab, publications]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Access to Email Section */}
        {profile.roles.includes("Admin") && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-black dark:text-gray-200">
              Access Management
            </h3>
            <div className="flex mb-6 border-b dark:border-gray-700">
              <button
                onClick={() => setActiveTab("grant")}
                className={`py-2 px-4 ${
                  activeTab === "grant"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                Grant Access
              </button>
              <button
                onClick={() => setActiveTab("revoke")}
                className={`py-2 px-4 ${
                  activeTab === "revoke"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                Revoke Access
              </button>
            </div>

            {activeTab === "grant" ? (
              <form onSubmit={handleGrantAccess}>
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setAccessType("individual")}
                    className={`px-4 py-2 rounded ${
                      accessType === "individual"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Individual Access
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccessType("domain")}
                    className={`px-4 py-2 rounded ${
                      accessType === "domain"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Domain Access
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block mb-2">
                    {accessType === "individual" ? "Email Address" : "Domain"}:
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={
                      accessType === "individual"
                        ? "Enter email"
                        : "Enter domain"
                    }
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-2"
                  >
                    <option value="">Select Role</option>
                    {Object.keys(panelService.rolemap).map((role) => (
                      <option key={role} value={role}>
                        {panelService.rolemap[role]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  disabled={!email || !role}
                >
                  Grant Access
                </button>
              </form>
            ) : (
              <form onSubmit={handleRevokeAccess}>
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setRevokeAccessType("individual")}
                    className={`px-4 py-2 rounded ${
                      revokeAccessType === "individual"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Individual Access
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevokeAccessType("domain")}
                    className={`px-4 py-2 rounded ${
                      revokeAccessType === "domain"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Domain Access
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block mb-2">
                    {revokeAccessType === "individual"
                      ? "Email Address"
                      : "Domain"}
                    :
                  </label>
                  <input
                    type="text"
                    value={revokeEmail}
                    onChange={(e) => setRevokeEmail(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={
                      revokeAccessType === "individual"
                        ? "Enter email"
                        : "Enter domain"
                    }
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-2"
                  >
                    <option value="">Select Role</option>
                    {Object.keys(panelService.rolemap).map((role) => (
                      <option key={role} value={role}>
                        {panelService.rolemap[role]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  disabled={!revokeEmail}
                >
                  Revoke Access
                </button>
              </form>
            )}
          </div>
        )}
          <RBACControls
              currentUserRole={profile.roles[0]}
              rbacPermissions={rbacPermissions}
              onPermissionChange={handlePermissionChange}
              onSaveRbacChanges={saveRbacChanges}
            />
        <div className="mb-8">
          <h2 className="text-xl font-bold dark:text-white mb-4">Approvals</h2>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex gap-4 mb-6">
              <select
                value={approvalType}
                onChange={(e) => setApprovalType(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="data">Data</option>
                <option value="visualization">Visualizations</option>
              </select>
            </div>

            {isLoadingApprovals ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : approvalRequests && approvalRequests.length > 0 ? (
              <div className="space-y-4">
                {approvalRequests
                  .filter(
                    (req) => approvalType === "all" || req.type === approvalType
                  )
                  .map((request) => (
                    <div
                      key={request._id}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div>
                        <p className="font-medium dark:text-white">
                          {request.file_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequest(request._id, "accepted")}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequest(request._id, "rejected")}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No Approval requests found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
          {/* Heading */}
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Publications
          </h3>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">
            <button
              onClick={() => setActiveTab("publications")}
              className={`text-lg font-medium ${
                activeTab === "publications"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              Publications
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`text-lg font-medium ${
                activeTab === "approved"
                  ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              Approved
            </button>
          </div>

          {/* Publications */}
          {filteredPublications && filteredPublications.length > 0 ? (
            <div className="space-y-4 mt-4">
              {filteredPublications.map((publication) => (
                <div
                  key={publication._id}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {publication.author}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Description: {publication.details}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Status:{" "}
                      <span
                        className={
                          publication.approved
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      >
                        {publication.approved ? "Approved" : "Pending"}
                      </span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {!publication.approved && (
                      <>
                        <button
                          onClick={() =>
                            handlePublication(publication._id, "approved")
                          }
                          className="bg-green-600 dark:bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-500 dark:hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handlePublication(publication._id, "disapproved")
                          }
                          className="bg-red-600 dark:bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
                        >
                          Disapprove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No publications found
            </div>
          )}
        </div>
        {/* Access Requests Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Access Requests
          </h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : accessRequests && accessRequests.length > 0 ? (
            <div className="space-y-4 mt-4">
              {accessRequests.map((request) => (
                <div
                  key={request._id}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {request.email_id}
                    </span>
                    <span>Message: {request.text}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Requested Role:{" "}
                      {request.role
                        .map(
                          (role) => role.charAt(0).toUpperCase() + role.slice(1)
                        )
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRequest(request._id, "accepted")}
                      className="bg-green-600 dark:bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-500 dark:hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequest(request._id, "rejected")}
                      className="bg-red-600 dark:bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No access requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;