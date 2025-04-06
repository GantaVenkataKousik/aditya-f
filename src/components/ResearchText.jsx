import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ResearchText = ({ data: propsData }) => {
  const [data, setData] = useState(propsData || null);
  const { id } = useParams();
  const fetchData = async () => {
    try {
      let userId = localStorage.getItem('userId');
      if (id) {
        userId = id;
      }
      const response = await fetch(`https://aditya-b.onrender.com/research/researchtext?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [propsData]);

  if (!data) {
    return <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', color: 'red' }}>No Research Data Found</p>;
  }

  const leftTableData = [
    { label: 'No. of SCI indexed articles', key: 'SciArticlesSize', marks: 'SciMarks', link: 'sciarticles' },
    { label: 'No. of Scopus/WoS articles (Max: 60)', key: 'WosArticlesSize', marks: 'WosMarks', link: 'wosarticles' },
    { label: 'No. of Proposals submitted/funded (Max: 10)', key: 'ProposalsSize', marks: 'ProposalMarks', link: 'proposals' },
  ];

  const rightTableData = [
    { label: 'No. of Conference Papers', key: 'PapersSize', marks: 'PapersMarks', link: 'papers' },
    { label: 'No. of Books authored', key: 'BooksSize', marks: 'BooksMarks', link: 'books' },
    { label: 'No. of Chapters authored', key: 'ChaptersSize', marks: 'ChaptersMarks', link: 'chapters' },
    { label: 'No. of Patents Granted', key: 'PGrantedSize', marks: 'PGrantedMarks', link: 'patentsGranted' },
    { label: 'No. of Patents Filed', key: 'PFiledSize', marks: 'PFiledMarks', link: 'patentsFiled' },
  ];

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <b style={{ fontSize: '23px' }}>4. Research Contributions:</b>
      <p>
        <b>
          (1 SCI article – 20, 1 Scopus/WoS article – 10, 1 Conference – 5, 1 Book -10, 1 Chapter – 5,
          1 Patent Granted-10, 1 Patent filed-5, 1 Project Proposal submitted/funded – 10)
        </b>
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        {/* Left Table */}
        <table
          border="1"
          cellPadding="10"
          style={{ width: '48%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '16px' }}
        >
          <thead>
            <tr style={{ backgroundColor: '#d0e8f2', fontWeight: 'bold' }}>
              <th>S.No</th>
              <th>Research Item</th>
              <th>Count</th>
              <th>Marks Obtained</th>

            </tr>
          </thead>
          <tbody>
            {leftTableData.map((item, index) => (
              <tr key={index}>
                <td>{String.fromCharCode(97 + index)}.</td>
                <td>
                  <a href={item.link}>{item.label}</a>
                </td>
                <td>{data[item.key] || 0}</td>
                <td>{data[item.marks] || 0}</td>
              </tr>
            ))}
            <tr>
              <td>d.</td>
              <td colSpan="2">
                <b>Research – Others (Max: 10)</b>
              </td>
              <td>
                <b>{data.SelfAssessment || 0}</b>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Right Table */}
        <table
          border="1"
          cellPadding="10"
          style={{ width: '48%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '16px' }}
        >
          <thead>
            <tr style={{ backgroundColor: '#d0e8f2', fontWeight: 'bold' }}>
              <th>Research - Others</th>
              <th>Count</th>
              <th>Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            {rightTableData.map((item, index) => (
              <tr key={index}>
                <td>
                  <a href={item.link}>{item.label}</a>
                </td>
                <td>{data[item.key] || 0}</td>
                <td>{data[item.marks] || 0}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">
                <b>Self-Assessment Marks (Max: 10)</b>
              </td>
              <td>
                <b>{data.SelfAssessment || 0}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResearchText;
