import React from 'react';
import { Button, Modal, Card, CardHeader, Typography, Stack } from '@mui/material';
import useIosInstallPrompt from '../app/shared/hooks/useIosInstallPrompt';
import useWebInstallPrompt from '../app/shared/hooks/useWebInstallPrompt';

const InstallPWA = (props) => {
    const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
    const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] = useWebInstallPrompt();


    if (!iosInstallPrompt && !webInstallPrompt) {
        return null;
    }
    return (
        <Modal open={props.showInstall}>
            <Card sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',

                p: 3
            }}>


                <CardHeader title="Install App" />
                {iosInstallPrompt && (
                    <>
                        <Typography variant="subtitle2">
                            Tap
                            share
                            then &quot;Add to Home Screen&quot;
                        </Typography>

                        <Button onClick={handleIOSInstallDeclined}>Close</Button>

                    </>
                )}
                {webInstallPrompt && (
                    <Stack>
                        <Button color="primary" onClick={handleWebInstallAccepted}>
                            Install
                        </Button>
                        <Button onClick={handleWebInstallDeclined}>Close</Button>
                    </Stack>
                )}

            </Card>
        </Modal>
    );
};

export default InstallPWA;