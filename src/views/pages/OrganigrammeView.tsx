import OrganigrammeManagement from '@/components/organigramme/organigramme-management'

const OrganigrammeView = () => {
    return (
        <div className="container  border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
 bg-[#FFFFFF] px-4 py-7 mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Gestion de l&apos;Organigramme</h1>
            <OrganigrammeManagement />
        </div>
    )
}
export default OrganigrammeView