import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar'; // ✅ Import Navbar

const Enquiries = () => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const monthShort = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;

        return `${day}-${monthShort}-${year} @${hours}:${minutes}${ampm} IST`;
    };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get("https://back-test-blond.vercel.app/api/contact");
                setContacts(res.data.contacts || []);
            } catch (err) {
                console.error("Error fetching contacts", err);
                setContacts([]);
            }
        };
        fetchContacts();
    }, []);

    const headers = contacts.length > 0
        ? Object.keys(contacts[0]).filter(key => key !== 'updatedAt')
        : [];

    const filteredContacts = contacts.filter(contact =>
        headers.some(key =>
            String(contact[key]).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredContacts.length / pageSize);
    const paginatedContacts = filteredContacts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact Submissions</h2>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <p className="text-gray-600 font-medium mb-2 sm:mb-0">
                        Total Forms Received: <span className="font-semibold">{filteredContacts.length}</span>
                    </p>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded px-3 py-1 w-full sm:w-64"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                {filteredContacts.length === 0 ? (
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
                                {paginatedContacts.map((contact) => (
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

                        {/* Pagination Controls */}
                        <div className="mt-4 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Enquiries;
