import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  font-family: Arial, sans-serif;
  width: 100%;
  max-width: 800px; /* You can adjust the max-width as needed */
  margin: 0 auto;
`;


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 8px;
`;

const TableData = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

const SearchInput = styled.input`
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

const TableComponent = ({ data, searchKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  
    const filtered = data.filter((item) =>
      Object.values(item).some((value) => {
        if (typeof value === 'string') {
            if(searchKey && !searchKey.includes('clear')) {
                return searchTerm.toLowerCase().includes(value.toLowerCase());
            }
          return value.toLowerCase().includes(searchTerm);
        }
        return false; // Ignore non-string values
      })
    );
  
    setFilteredData(filtered);
  };

  useEffect(() => {
    if(searchKey && searchKey.includes('clear')) {
        handleSearch({target: {value: ''}});
    } else {
        handleSearch({target: {value: searchKey}})

    }
  }, [searchKey]);

  return (
    <TableWrapper>
      <SearchInput
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Age</TableHeader>
            <TableHeader>Country</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <TableData>{item.name}</TableData>
              <TableData>{item.age}</TableData>
              <TableData>{item.country}</TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default TableComponent;
