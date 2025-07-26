import axios from 'axios';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar';

function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://backtest-0ggn.onrender.com/api/contact", formData);
            toast.success("Form submitted successfully");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error(err.response?.data?.error || "Submission failed");
        }
    };
    return (
        <>
            <Navbar />

            <div className="p-4 mx-auto max-w-xl bg-white">
                <ToastContainer />
                <h2 className="text-3xl text-slate-900 font-bold">Contact us</h2>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className='text-sm text-slate-900 font-medium mb-2 block'>Name</label>
                        <input
                            type='text'
                            name='name'
                            placeholder='Enter Name'
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full py-2.5 px-4 text-slate-800 bg-gray-100 border border-gray-200 focus:border-slate-900 focus:bg-transparent text-sm outline-0 transition-all"
                        />
                    </div>
                    <div>
                        <label className='text-sm text-slate-900 font-medium mb-2 block'>Email</label>
                        <input
                            type='email'
                            name='email'
                            placeholder='Enter Email'
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full py-2.5 px-4 text-slate-800 bg-gray-100 border border-gray-200 focus:border-slate-900 focus:bg-transparent text-sm outline-0 transition-all"
                        />
                    </div>
                    <div>
                        <label className='text-sm text-slate-900 font-medium mb-2 block'>Subject</label>
                        <input
                            type='text'
                            name='subject'
                            placeholder='Enter Subject'
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full py-2.5 px-4 text-slate-800 bg-gray-100 border border-gray-200 focus:border-slate-900 focus:bg-transparent text-sm outline-0 transition-all"
                        />
                    </div>
                    <div>
                        <label className='text-sm text-slate-900 font-medium mb-2 block'>Message</label>
                        <textarea
                            name='message'
                            placeholder='Enter Message'
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 text-slate-800 bg-gray-100 border border-gray-200 focus:border-slate-900 focus:bg-transparent text-sm pt-3 outline-0 transition-all"
                        ></textarea>
                    </div>
                    <button type='submit'
                        className="text-white bg-slate-900 font-medium hover:bg-slate-800 tracking-wide text-sm px-4 py-2.5 w-full border-0 outline-0 cursor-pointer">Send message</button>
                </form>
            </div>   </>
    )
}

export default Contact 
