import axios from 'axios';
import { useEffect, useState } from 'react';
import { Search, Mail, Calendar, User } from 'lucide-react';

const Enquiries = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

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
                setLoading(true);
                const res = await axios.get("https://doctor-omega-rouge.vercel.app/api/contact");
                setContacts(res.data.contacts || []);
            } catch (err) {
                console.error("Error fetching contacts", err);
                setContacts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const filteredContacts = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
                    <p className="text-gray-600">Manage contact form submissions</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>{filteredContacts.length} enquiries</span>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, subject..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="text-sm text-gray-600">
                        {filteredContacts.length} of {contacts.length} enquiries
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        Loading enquiries...
                                    </td>
                                </tr>
                            ) : paginatedContacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        {searchQuery ? 'No enquiries found matching your search' : 'No enquiries found'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedContacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <User size={16} className="text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.subject}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="max-w-xs truncate" title={contact.message}>
                                                {contact.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1" />
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                        currentPage === idx + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Enquiries;
