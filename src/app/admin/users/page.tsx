'use client';

import { useEffect, useState } from 'react';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import { FaTrash, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import { getErrorMessage } from '@/lib/errorMessage';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  full_name: string;
}

function ManageUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: UserProfile[] = await res.json();
      setUsers(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (window.confirm(`Are you sure you want to change the role of this user to ${newRole}?`)) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        // Update local state
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`,
          {
            method: 'DELETE',
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        // Update local state
        setUsers(users.filter(user => user.id !== userId));
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600">
          <FaExclamationTriangle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Full Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaUsers size={28} className="text-gray-300" />
                      No users found.
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                  >
                    <td className="p-4 text-xs text-gray-500">{user.id}</td>
                    <td className="p-4 text-gray-800">{user.email}</td>
                    <td className="p-4 text-gray-800">{user.full_name}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDeleteUser(user.id)} className="flex items-center gap-1.5 text-red-500 hover:underline text-sm font-medium cursor-pointer">
                        <FaTrash size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default withAdminAuth(ManageUsersPage);