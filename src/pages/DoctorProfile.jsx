import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const DoctorProfile = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`https://doctor-omega-rouge.vercel.app/api/doctor/${user.id}`);
        const data = res.data.data?.[0] || res.data;

        // Normalize date/time fields for inputs
        const normalizeDate = (val) =>
          val ? new Date(val).toISOString().split("T")[0] : "";
        const normalizeTime = (val) => (val ? val.slice(0, 5) : "");

        const normalizedData = {
          ...data,
          available_date: normalizeDate(data.available_date),
          dob: normalizeDate(data.dob),
          start_time: normalizeTime(data.start_time),
          end_time: normalizeTime(data.end_time),
          break_start: normalizeTime(data.break_start),
          break_end: normalizeTime(data.break_end),
        };

        setDoctor(normalizedData);
        setFormData(normalizedData);
      } catch (err) {
        toast.error("Failed to fetch doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Preview selected image
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) {
      data.set("profile_image", imageFile); // overwrite preview URL with actual file
    }

    try {
      await axios.put(
        `https://doctor-omega-rouge.vercel.app/api/updateDoctor/${user.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img
            src={
              formData?.profile_image ||
              doctor?.profile_image ||
              "https://via.placeholder.com/150?text=No+Image"
            }
            alt="Doctor"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{doctor?.full_name}</h2>
            <p className="text-gray-500">{doctor?.specialization}</p>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full mt-2 ${
                doctor?.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {doctor?.status}
            </span>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Update Form */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { label: "Full Name", name: "full_name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Available Date", name: "available_date", type: "date" },
            { label: "Start Time", name: "start_time", type: "time" },
            { label: "End Time", name: "end_time", type: "time" },
            { label: "Break Start", name: "break_start", type: "time" },
            { label: "Break End", name: "break_end", type: "time" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-1 font-medium">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Profile Image</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DoctorProfile;
