import Dashboard from '@/components/dashboard/dashboard'

const Home = () => {
    return (
        <div className="container  border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
 bg-[#FFFFFF] px-4 py-7 mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <Dashboard />
        </div>
    )
}

export default Home
