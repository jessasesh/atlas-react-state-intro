import React, { useState, useEffect } from "react";

export default function SchoolCatalog() {
  // State that holds the courses data
  const [courses, setCourses] = useState([]);
  // State that holds search query
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter courses based on the search query
  const filteredCourses = courses.filter((course) => {
    const courseNumber = course.courseNumber.toLowerCase();
    const courseName = course.courseName.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      courseNumber.includes(query) || courseName.includes(query)
    );
  });

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
            <th>Trimester</th>
            <th>Course Number</th>
            <th>Courses Name</th>
            <th>Semester Credits</th>
            <th>Total Clock Hours</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, index) => (
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
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  );
}
