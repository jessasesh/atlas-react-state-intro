import React, { useState, useEffect } from "react";

export default function SchoolCatalog() {
  // State that holds the courses data
  const [courses, setCourses] = useState([]);
  // State that holds search query
  const [searchQuery, setSearchQuery] = useState('');
  // State to track column to be sorted by
  const [sortKey, setSortKey] = useState('');
  // State to track sort direction
  const [sortDirection, setSortDirection] = useState("asc");
  // State to track the active page for pagination
  const [activePage, setActivePage] = useState(0);
  // Rows per page
  const rowsPerPage = 5;

  // Fetch data when component mounts
  useEffect(() => {
    fetch('/api/courses.json')
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error('Error when fetching data:', error);
      });
  }, []);

  const updateSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  // Sorting the courses based on current sortKey and sortDirection
  const sortedCourses = [...courses].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  // Filter courses based on the search query
  const filteredCourses = sortedCourses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.courseNumber.toLowerCase().includes(query) ||
      course.courseName.toLowerCase().includes(query)
    );
  });

  // Handle sort toggle when column header is clicked
  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Courses to display
  const currentCourses = filteredCourses.slice(
    activePage * rowsPerPage,
    (activePage + 1) * rowsPerPage
  );

  // Handle pagination logic
  const handleNextPage = () => {
    if ((activePage + 1) * rowsPerPage < filteredCourses.length) {
      setActivePage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (activePage > 0) {
      setActivePage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={updateSearchQuery}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('trimester')}>Trimester</th>
            <th onClick={() => handleSortChange('courseNumber')}>Course Number</th>
            <th onClick={() => handleSortChange('courseName')}>Course Name</th>
            <th onClick={() => handleSortChange('semesterCredits')}>Semester Credits</th>
            <th onClick={() => handleSortChange('totalClockHours')}>Total Clock Hours</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course, index) => (
            <tr key={index}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={activePage === 0}>
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={(activePage + 1) * rowsPerPage >= filteredCourses.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}
