import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contactRes = await axios.get("https://back-test-blond.vercel.app/api/contact");
                setContacts(contactRes?.data?.contacts);

                const adminRes = await axios.get("https://back-test-blond.vercel.app/api/admin/getAdmin");
                setAdmins(adminRes?.data?.admins);
            } catch (err) {
                console.error("Error fetching data:", err);
                setContacts([]);
                setAdmins([]);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto border border-gray-300">
                    <div className="flex flex-col items-center justify-center py-6 border-r border-gray-300">
                        <h3 className="text-lg font-bold">Total Admin Users</h3>
                        <p className="text-3xl font-semibold mt-2">{admins.length}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center py-6">
                        <h3 className="text-lg font-bold">Total Enquiries</h3>
                        <p className="text-3xl font-semibold mt-2">{contacts.length}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
