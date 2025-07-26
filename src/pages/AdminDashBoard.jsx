import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'; // npm install moment
import Navbar from '../Navbar';

function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get("https://backtest-0ggn.onrender.com/api/contact");
                setContacts(res.data.contacts || []);
            } catch (err) {
                setContacts([]);
            }
        };
        fetchContacts();
    }, []);

    // Remove 'updatedAt' field from display
    const headers = contacts.length > 0
        ? Object.keys(contacts[0]).filter(key => key !== 'updatedAt')
        : [];

    return (
        <>
        <Navbar/>
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Contact Submissions</h2>

            {/* Total Forms Count */}
            <p className="mb-4 text-gray-600 font-medium">
                Total Forms Received: <span className="font-semibold">{contacts.length}</span>
            </p>

            {contacts.length === 0 ? (
                <p className="text-gray-500 font-semibold">No Data Available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 whitespace-nowrap">
                            <tr>
                                {headers.map((key) => (
                                    <th key={key} className="px-4 py-4 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                            {contacts.map((contact) => (
                                <tr key={contact.id}>
                                    {headers.map((key) => (
                                        <td key={key} className="px-4 py-4 text-sm text-slate-900 font-medium">
                                            {key === 'createdAt'
                                                ? formatDate(contact[key])
                                                : contact[key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </>
    );
}

export default Dashboard;
