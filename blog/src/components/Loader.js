import React from 'react';
import { Box, Card, CardHeader, CardContent, Skeleton } from '@mui/material';

const Loader = () => {
    return (
        <div className="loader">
            <div className="loader-blog">
                <Card sx={{ margin: "auto", mt: 2, padding: 2, boxShadow: "1px 1px 5px #ccc" }}>
                    <CardHeader
                        avatar={
                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        }
                        title={
                            <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
                        }
                        subheader={
                            <Skeleton animation="wave" height={10} width="40%" />
                        }
                    />
                    <Skeleton animation="wave" variant="rectangular" height={210} />
                    <CardContent>
                        <Skeleton animation="wave" height={10} width="80%" />
                        <Skeleton animation="wave" height={10} width="60%" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Loader;
