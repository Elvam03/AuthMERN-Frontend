import { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../Components/adminNavbar";

const AdminResource = () => {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: "", content: "", author: "", type: "", causes: "", diagnosis: "", treatment: "", exercise: "" });
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({ title: "", content: "", author: "", type: "", causes: "", diagnosis: "", treatment: "", exercise: "" });
  const [editResourceId, setEditResourceId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (resource) => {
    setEditData({ title: resource.title, content: resource.content, author: resource.author, causes: resource.causes, type: resource.type, diagnosis: resource.diagnosis, treatment: resource.treatment, exercise: resource.exercise });
    setEditResourceId(resource._id);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await editResource(editResourceId, editData);
      setShowEditModal(false);
    } catch (error) {
      setError("Failed to update resource.");
    }
  };


  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    } else {
      fetchResources();
    }
  }, [user, navigate]);

  const fetchResources = async () => {
    try {
      const res = await fetch("https://authmern-backend-i3kc.onrender.com/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (error) {
      setError("Error fetching resources.");
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://authmern-backend-i3kc.onrender.com/api/add-resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newResource),
      });

      if (!res.ok) throw new Error("Failed to add resource.");

      setNewResource({ title: "", content: "", author: "", type: "", causes: "", diagnosis: "", treatment: "", exercise: "" });
      fetchResources();
    } catch (error) {
      setError("Error adding resource.");
    }
  };

  const deleteResource = async (id) => {
    try {
      const res = await fetch(`https://authmern-backend-i3kc.onrender.com/api/delete-resource/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete resource.");

      fetchResources();
    } catch (error) {
      setError("Error deleting resource.");
    }
  };

  const editResource = async (id, updatedData) => {
    try {
      const res = await fetch(`https://authmern-backend-i3kc.onrender.com/api/edit-resource/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update resource.");

      fetchResources(); // Refresh resources list
    } catch (error) {
      setError("Error updating resource.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">

      <div className="sticky top-0 z-10"> 
      <AdminNavbar />
      </div>
      <h1 className="text-3xl font-semibold m-4 ">Admin Dashboard</h1>

      <form onSubmit={handleAddResource} className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded w-full mb-2"
          value={newResource.title}
          onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          className="border p-2 rounded w-full mb-2"
          value={newResource.content}
          onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
        />
        <textarea
          placeholder="Author"
          className="border p-2 rounded w-full mb-2"
          value={newResource.author}
          onChange={(e) => setNewResource({ ...newResource, author: e.target.value })}
        />
        <textarea
          placeholder="Causes"
          className="border p-2 rounded w-full mb-2"
          value={newResource.causes}
          onChange={(e) => setNewResource({ ...newResource, causes: e.target.value })}
        />
        <textarea
          placeholder="diagnosis"
          className="border p-2 rounded w-full mb-2"
          value={newResource.diagnosis}
          onChange={(e) => setNewResource({ ...newResource, diagnosis: e.target.value })}
        />
        <textarea
          placeholder="treatment"
          className="border p-2 rounded w-full mb-2"
          value={newResource.treatment}
          onChange={(e) => setNewResource({ ...newResource, treatmen: e.target.value })}
        />
        <label className="block mb-2">Exercises (comma-separated):</label>
        <input
          type="text"
          value={newResource.exercise}
          onChange={(e) => setNewResource(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Type (e.g., Article, Blog)"
          className="border p-2 rounded w-full mb-2"
          value={newResource.type}
          onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Resource
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <h2 className="text-2xl font-semibold mt-6">Existing Resources</h2>
      <ul className="mt-4">
        {resources.map((resource) => (
          <li key={resource._id} className="bg-white p-4 rounded-lg shadow mb-2 flex justify-between">
            <div>

              <h3 className="text-xl font-medium">{resource.title}</h3>
              <p>{resource.author}</p>
              <p>{resource.content}</p>
              <p className="text-sm text-gray-500">{resource.type}</p>
              <p>{resource.causes}</p>
              <p>{resource.diagnosis}</p>
              <p>{resource.treatment}</p>
              <p>{resource.exercise}</p>
            </div>
            <div>
              <button className="bg-green-500 text-white px-3 py-1 rounded m-2" onClick={() => handleEditClick(resource)}>Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded m-2" onClick={() => deleteResource(resource._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Resource</h2>

            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
            <textarea
              className="border p-2 rounded w-full mb-2"
              value={editData.content}
              placeholder="content"
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="author"
              value={editData.author}
              onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="causes"
              value={editData.causes}
              onChange={(e) => setEditData({ ...editData, causes: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="diagnosis"
              value={editData.diagnosis}
              onChange={(e) => setEditData({ ...editData, diagnosis: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="treatment"
              value={editData.treatment}
              onChange={(e) => setEditData({ ...editData, treatment: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="exercise"
              value={editData.exercise}
              onChange={(e) => setEditData({ ...editData, exercise: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="type"
              value={editData.type}
              onChange={(e) => setEditData({ ...editData, type: e.target.value })}
            />

            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleSaveEdit}>
                Save Changes
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminResource;
