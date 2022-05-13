import { useState} from 'react';
import { Box,Tab, Tabs} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// components
import WorkToday from './WorkToday';
import WorkMonthly from './WorkMonthly';
import Page from '../components/Page';

export default function MyCollections() {
    const [value, setValue] = useState('1');


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Page title="My Collections">
            <Box maxWidth="xl" sx={{ width: "100%" }}>
                
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs variant="fullWidth" value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" aria-label="Daily and Monthly">
                            <Tab label="Daily" value="1" />
                            <Tab label="Monthly" value="2" />

                        </Tabs>
                    </Box>
                    <TabPanel value="1">
                       <WorkToday/>

                    </TabPanel>
                    <TabPanel value="2">
                        <WorkMonthly/>
                    </TabPanel>

                </TabContext>
            </Box>
        </Page>
    );
}
