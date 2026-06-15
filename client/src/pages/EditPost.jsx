import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../hooks/axios";

const CATEGORIES = ["tech", "business", "entertainment", "general", "lifestyle"];

export default function EditPost() {
  const { id } = useParams();       
  const navigate = useNavigate();
  const axios = useAxios();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "draft",
    imageUrl: "",
    content: "",
    scheduledFor: "",
  });

  const [originalStatus, setOriginalStatus] = useState("draft"); 
  const [fetchLoading, setFetchLoading] = useState(true);       
  const [submitLoading, setSubmitLoading] = useState(false);     
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

 
  useEffect(() => {
    async function fetchPost() {
      try {
        setFetchLoading(true);
        const { data } = await axios.get(`/news/getpost/${id}`);
        const post = data.post;

        setFormData({
          title:        post.title        ?? "",
          category:     post.category     ?? "",
          status:       post.status       ?? "draft",
          imageUrl:     post.imageUrl     ?? "",
          content:      post.content      ?? "",
          scheduledFor: post.scheduledFor
            ? new Date(post.scheduledFor).toISOString().slice(0, 16)  
            : "",
        });
        setOriginalStatus(post.status ?? "draft");

      } catch (err) {
        setError(err?.response?.data?.message ?? "Failed to load post.");
      } finally {
        setFetchLoading(false);
      }
    }
    fetchPost();
  }, [id]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = async (targetStatus) => {
    setError(null);
    setSuccessMsg(null);

   
    if (!formData.title || !formData.category || !formData.content) {
      setError("Title, category and content are required.");
      return;
    }
    if (targetStatus === "scheduled" && !formData.scheduledFor) {
      setError("Please pick a date and time to schedule the post.");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = {
        ...formData,
        status: targetStatus,
        scheduledFor: targetStatus === "scheduled" ? formData.scheduledFor : null,
      };

      const { data } = await axios.put(`/news/update/${id}`, payload);

      if (data.success || data.post) {
        setSuccessMsg(`Post ${getActionLabel(targetStatus)} successfully.`);
        setOriginalStatus(targetStatus);
        setFormData((prev) => ({ ...prev, status: targetStatus }));

       
        setTimeout(() => navigate("/category"), 1200);
      }

    } catch (err) {
      setError(err?.response?.data?.message ?? "Update failed. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

 
  const openSchedulePicker = () => {
    setFormData((prev) => ({ ...prev, status: "scheduled" }));
  };

 
  const cancelSchedule = () => {
    setFormData((prev) => ({ ...prev, status: originalStatus, scheduledFor: "" }));
  };

 
  function getActionLabel(status) {
    const map = {
      draft:     "saved as draft",
      in_review:    "sent for approval",
      published: "published",
      scheduled: "scheduled",
    };
    return map[status] ?? "updated";
  }


  if (fetchLoading) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

     
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Edit Article</h2>
          <p className="text-xs text-gray-500 mt-0.5">Update the details and choose an action below.</p>
        </div>
      
        <StatusBadge status={originalStatus} />
      </div>

     
      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          ⚠ {error}
        </div>
      )}

   
      {successMsg && (
        <div className="mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          ✓ {successMsg}
        </div>
      )}

    
      <form className="p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>

     
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Article title"
            className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400"
          />
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg bg-white outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 text-gray-700"
            >
              <option value="" disabled hidden>Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400"
            />
          </div>
        </div>

       
        {formData.status === "scheduled" && (
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <label htmlFor="scheduledFor" className="block text-sm font-medium text-blue-900 mb-1.5">
              Publish date & time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="scheduledFor"
              name="scheduledFor"
              value={formData.scheduledFor}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}  // can't schedule in the past
              className="w-full sm:w-auto text-sm px-3.5 py-2 border border-blue-200 rounded-lg outline-none bg-white text-gray-700 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-xs text-blue-600 mt-1.5">
              Post will go live automatically at this time.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1.5">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your article body here..."
            className="w-full text-sm px-3.5 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 placeholder:text-gray-400 resize-none"
          />
        </div>

       
        <div className="pt-2 border-t border-gray-100 space-y-3">

          <div className="flex flex-wrap items-center gap-2">

            
            <button
              type="button"
              disabled={submitLoading}
              onClick={() => handleSubmit(originalStatus)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {submitLoading ? "Saving…" : "Save changes"}
            </button>

          
            {formData.status === "draft" && (
              <>
                {/* Draft →in_review */}
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => handleSubmit("in_review")}
                  className="px-4 py-2 border border-violet-200 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-50 transition-colors disabled:opacity-50"
                >
                  Send for approval
                </button>

                {/* Draft → open schedule picker */}
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={openSchedulePicker}
                  className="px-4 py-2 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  Schedule
                </button>

                {/* Draft → Publish now */}
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => handleSubmit("published")}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  Publish now
                </button>
              </>
            )}

           
            {formData.status === "in_review" && (
              <>
                {/* in_review → back to Draft */}
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => handleSubmit("draft")}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Back to draft
                </button>
                {/* in_review -> schedule */}
                 <button
                  type="button"
                  disabled={submitLoading}
                  onClick={openSchedulePicker}
                  className="px-4 py-2 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  Schedule
                </button>

                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => handleSubmit("published")}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  Publish now
                </button>
              </>
            )}

           
            {formData.status === "scheduled" && (
              <>
              
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => handleSubmit("scheduled")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  Confirm schedule
                </button>

               
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={cancelSchedule}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}

           
            {formData.status === "published" && (
              <button
                type="button"
                disabled={submitLoading}
                onClick={() => handleSubmit("draft")}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Unpublish
              </button>
            )}

          </div>

       
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Discard and go back
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

// ── Small status badge shown in the header ────────────────────
function StatusBadge({ status }) {
  const styles = {
    draft:     "bg-yellow-100 text-yellow-700",
    in_in_review:    "bg-purple-100 text-purple-700",
    published: "bg-green-100 text-green-700",
    scheduled: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}