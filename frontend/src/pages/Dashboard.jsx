
import  { useEffect, useState } from 'react';

const AdminDashboard = () => {

  const [users, setUsers] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [addBalanceDetails, setAddBalanceDetails] = useState({
    id: '',
    amount: ''
  });

  const deleteUser = async(userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    try{
      const response = await fetch(`http://localhost:8000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'username': '9999',
                'password': 'admin'
            },
            redirect: 'follow'
        });
        if(response.status !== 200){
          console.log("failed to delete the user")
        }

    }
    catch(err){
      console.log(err)
    }
    setUsers(updatedUsers);
  };

  useEffect(() => {
    const getUsers = async () => {
        const response = await fetch('http://localhost:8000/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'username': '9999',
                'password': 'admin'
            },
            redirect: 'follow'
        });
        const data = await response.json();
        setUsers(data)
    }
    getUsers();

    }, []);


    const handleCreateUser = async () => {
        try{
            const response = await fetch('http://localhost:8000/users', {
                method: 'PUT',
                headers: {
                    'username': '9999',
                    'password': 'admin'
                },
                redirect: 'follow'
                })
            const data = await response.json();
            setUsers((prev)=> [data, ...prev]);
        }
        catch(err){
            console.log(err);
        }
    }

    const handleAddBalance = async (e) => {
      e.preventDefault();
      const user_id = addBalanceDetails.id;
      const amount = addBalanceDetails.amount;
        try{
            const response = await fetch(`http://localhost:8000/users/${user_id}/wallet?amount=${amount}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'username': '9999',
                    'password': 'admin'
                },
                redirect: 'follow'
                })
            const data = await response.json();
            console.log(data);
            if(response.status === 200)
            {
              setShowCard(false);
              setAddBalanceDetails({
                id: '',
                amount: ''
              });
              setUsers((prev)=> prev.map((user) => { 
                if(user.id === user_id){
                  return {
                    ...user,
                    wallet: data.wallet_balance
                  }
                }
                return user;
              }));

            }
        }
        catch(err){
          console.log(err);
        }

    }
  return (
    <div className="container mx-auto p-4">
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-[150px]">
      <h1 className="text-3xl font-semibold mb-4 md:mb-0">Admin Dashboard</h1>
      <div className="flex gap-4">
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 rounded-full text-white bg-green-500 hover:bg-green-600 focus:outline-none"
        >
          Create User
        </button>
        <button
          onClick={() => setShowCard((prev) => !prev)}
          className="px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
        >
          Add Balance
        </button>
        <button

          className="px-4 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 focus:outline-none"
        >
          Deduct Balance
        </button>
      </div>
    </div>
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">Username</th>
          <th className="py-2 px-4 border-b">Password</th>
          <th className="py-2 px-4 border-b">Balance</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b">
            <td className="py-2 px-4 text-center">{user.id}</td>
            <td className="py-2 px-4 text-center">{user.password}</td>
            <td className="py-2 px-4 text-center">Rs {user.wallet_balance}</td>
            <td className="py-2 px-4 text-center">
              <button
                onClick={() => deleteUser(user.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {
      showCard && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Add Balance</h2>
            <form onSubmit={handleAddBalance} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={addBalanceDetails.id}
                onChange={(e) => setAddBalanceDetails((prev) => ({ ...prev, id: e.target.value }))}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                onChange={(e) => setAddBalanceDetails((prev) => ({ ...prev, amount: e.target.value }))}
                value={addBalanceDetails.amount}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none"
                >
                  Add
                </button>
                <button

                  onClick={() => setShowCard(false)}
                  className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }
  </div>
  );
};

export default AdminDashboard;
