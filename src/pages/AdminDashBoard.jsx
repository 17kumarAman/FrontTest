import axios from 'axios';
import { useEffect, useState } from 'react';
import { Users, MessageSquare, UserPlus, Activity } from 'lucide-react';

function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [contactRes, doctorRes] = await Promise.all([
                    axios.get("https://doctor-omega-rouge.vercel.app/api/contact"),
                    axios.get("https://doctor-omega-rouge.vercel.app/api/allDoctors")
                ]);
                
                setContacts(contactRes?.data?.contacts || []);
                setDoctors(doctorRes?.data?.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setContacts([]);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        {
            title: "Total Enquiries",
            value: contacts.length,
            icon: MessageSquare,
            color: "bg-blue-500",
            textColor: "text-blue-500"
        },
        {
            title: "Total Doctors",
            value: doctors.length,
            icon: Users,
            color: "bg-green-500",
            textColor: "text-green-500"
        },
        {
            title: "Active Doctors",
            value: doctors.filter(d => d.status === 'Active').length,
            icon: UserPlus,
            color: "bg-purple-500",
            textColor: "text-purple-500"
        },
        {
            title: "Recent Activity",
            value: contacts.filter(c => {
                const date = new Date(c.createdAt);
                const now = new Date();
                const diffTime = Math.abs(now - date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
            }).length,
            icon: Activity,
            color: "bg-orange-500",
            textColor: "text-orange-500"
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enquiries */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Enquiries</h3>
                    </div>
                    <div className="p-6">
                        {contacts.slice(0, 5).length > 0 ? (
                            <div className="space-y-4">
                                {contacts.slice(0, 5).map((contact) => (
                                    <div key={contact.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                            <p className="text-sm text-gray-500">{contact.email}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent enquiries</p>
                        )}
                    </div>
                </div>

                {/* Recent Doctors */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Recent Doctors</h3>
                    </div>
                    <div className="p-6">
                        {doctors.slice(0, 5).length > 0 ? (
                            <div className="space-y-4">
                                {doctors.slice(0, 5).map((doctor) => (
                                    <div key={doctor.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{doctor.full_name}</p>
                                            <p className="text-sm text-gray-500">{doctor.specialization}</p>
                                        </div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            doctor.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {doctor.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No doctors found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
