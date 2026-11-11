import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import { TabPanel } from '../../../../shared/TabPanel';

function SavedQuestions() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Suggested Questions" {...a11yProps(0)} />
          <Tab label="Saved Templates" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
       
      </TabPanel>
      <TabPanel value={value} index={1}>
        
      </TabPanel>
    </>
  )
}

export default SavedQuestions