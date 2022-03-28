import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../providers/AppProvider';

export default function CustomerAnalyticsGraph(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError } = useApp();

    useEffect(() => {
        setLoading(true);
    }, [handleHttpError, loading]);

    return <></>
}
