import { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/authContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: "", description: "", type: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    } else {
      fetchResources();
    }
  }, [user, navigate]);

  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (error) {
      setError("Error fetching resources.");
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/add-resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newResource),
      });

      if (!res.ok) throw new Error("Failed to add resource.");

      setNewResource({ title: "", description: "", type: "" });
      fetchResources();
    } catch (error) {
      setError("Error adding resource.");
    }
  };

  const deleteResource = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/delete-resource/${id}`, {
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
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>

      <form onSubmit={handleAddResource} className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded w-full mb-2"
          value={newResource.title}
          onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border p-2 rounded w-full mb-2"
          value={newResource.description}
          onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
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
              <p>{resource.description}</p>
              <p className="text-sm text-gray-500">{resource.type}</p>
            </div>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteResource(resource._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
