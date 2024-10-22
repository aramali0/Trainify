import React from 'react';
import SearchBar from '../components/Dashboard/SearchBar';
import IconCard from '../components/Dashboard/IconCard';
import UserProfile from '../components/Dashboard/UserProfile';
import Table from '../components/Dashboard/Table';
import Pagination from '../components/Dashboard/Pagination';

const MainPage = () => {
    const user = {
        name: "John Doe",
        avatar: "/path-to-avatar.jpg",
        students: 200,
        courses: 10
    };

    const tableData = [
        { course: "Advanced Mathematics", category: "Math", classes: 5, instructor: "Jane Smith", students: 50 },
        // More rows...
    ];

    const currentPage = 1;
    const totalPages = 10;

    return (
        <div className="flex flex-wrap">
            {/* Left Side */}
            <div className="w-full lg:w-8/12 p-4">
                {/* Search Bar */}
                <SearchBar onAdd={() => console.log('Add Customer Clicked')} />

                {/* Icon Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <IconCard icon="ph-philography" iconColor="indigo-700" bgColor="bg-indigo-200" title="Courses" linkText="View More" />
                    <IconCard icon="ph-users" iconColor="orange-700" bgColor="bg-orange-200" title="Students" linkText="View More" />
                    <IconCard icon="ph-book" iconColor="green-700" bgColor="bg-green-200" title="Instructors" linkText="View More" />
                </div>

                {/* Table */}
                <div className="mt-6">
                    <Table data={tableData} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => console.log(page)} />
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-4/12 p-4">
                <UserProfile user={user} />
            </div>
        </div>
    );
};

export default MainPage;
