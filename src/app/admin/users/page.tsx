'use client';

import { useEffect, useState } from 'react';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';

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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>
      {error && <p className="text-red-500 py-4">{error}</p>}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">ID</th>
              <th className="p-4">Email</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm">{user.id}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.full_name}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default withAdminAuth(ManageUsersPage);