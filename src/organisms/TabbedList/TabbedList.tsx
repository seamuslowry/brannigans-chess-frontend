import React from 'react';
import { Box, Tab, Tabs } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

interface Props {
  tabOptions: { label: string; value: number }[];
  tabValue: number;
  onTabChange: (v: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (v: number) => void;
}

const TabbedList: React.FC<Props> = ({
  tabOptions,
  tabValue,
  onTabChange,
  page,
  totalPages,
  onPageChange,
  children
}) => {
  const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) =>
    onPageChange(newPage);
  const handleTabChange = (e: React.ChangeEvent<unknown>, newTab: number) => onTabChange(newTab);

  return (
    <Box width="100%">
      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        {tabOptions.map(o => (
          <Tab key={`tab-list-${o.value}`} value={o.value} label={o.label} />
        ))}
      </Tabs>
      {children}
      <Box my={1} display="flex" justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={handlePageChange} size="large" />
      </Box>
    </Box>
  );
};

export default TabbedList;
