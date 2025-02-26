'use client'

import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import Calendar, { type Props as ActivityCalendarProps } from 'react-activity-calendar'
import Image from '../assets/ImageBox'

interface Props extends Omit<ActivityCalendarProps, 'data' | 'theme'> {
    username: string
}

async function fetchCalendarData(username: string): Promise<ApiResponse> {
    const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    )
    const data: ApiResponse | ApiErrorResponse = await response.json()

    if (!response.ok) {
        throw Error(
            `Fetching GitHub contribution data for "${username}" failed: ${
                (data as ApiErrorResponse).error
            }`
        )
    }

    return data as ApiResponse
}

const GithubCalendar: FunctionComponent<Props> = ({ 
    username, 
    blockMargin = 6, 
    blockSize = 20, 
    blockRadius = 7, 
    ...props 
}) => {
    const [data, setData] = useState<ApiResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [calendarParams, setCalendarParams] = useState({
        blockSize: 20,
        blockMargin: 6,
        blockRadius: 7,
        scale: 0.95,
        daysToShow: 133 // default
    });

    const fetchData = useCallback(() => {
        setLoading(true)
        setError(null)
        fetchCalendarData(username)
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false))
    }, [username])

    useEffect(() => {
        const updateParams = () => {
            const width = window.innerWidth;
            
            if (width <= 400) {  // bento-sm
                setCalendarParams({
                    blockSize: 10,
                    blockMargin: 4,
                    blockRadius: 5,
                    scale: 1,
                    daysToShow: 100 // fewer days for smaller layouts
                });
            } else if (width <= 799) {  // bento-md
                setCalendarParams({
                    blockSize: 14,
                    blockMargin: 5,
                    blockRadius: 5,
                    scale: 0.8,
                    daysToShow: 120
                });
            } else if (width <= 1199) {
                setCalendarParams({
                    blockSize: 14,
                    blockMargin: 6,
                    blockRadius: 5,
                    scale: 0.85,
                    daysToShow: 123
                });
        } else {  // bento-lg
                setCalendarParams({
                    blockSize: 20,
                    blockMargin: 6,
                    blockRadius: 7,
                    scale: 0.95,
                    daysToShow: 133 // original number of days
                });
            }
        };

        // Initial call
        updateParams();

        // Add resize listener
        window.addEventListener('resize', updateParams);

        // Cleanup
        return () => window.removeEventListener('resize', updateParams);
    }, []);

    useEffect(fetchData, [fetchData])

    // Modify selectLastNDays to use dynamic days
    const selectLastNDays = (contributions: Activity[]) => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - calendarParams.daysToShow)

        return contributions.filter((activity) => {
            const activityDate = new Date(activity.date)
            return activityDate >= startDate && activityDate <= today
        })
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Image
                    src="/svg/lewis-gh-down.svg"
                    alt="GitHub Contributions Unavailable"
                    fill
                    className="rounded-3xl object-cover"
                    skeletonClassName="rounded-3xl"
                    noRelative
                    unoptimized
                    priority
                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 2}}
                />
            </div>
        )
    }

    if (loading || !data) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse bg-muted/20 rounded-3xl w-full h-full"></div>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <div 
                className="flex items-center justify-center" 
                style={{ 
                    transform: `scale(${calendarParams.scale})`, 
                    overflow: 'hidden' 
                }}
            >
                <Calendar
                    data={selectLastNDays(data.contributions)}
                    theme={{
                        dark: ['#1A1A1A', '#E9D3B6'],
                        light: ['#1A1A1A', '#E9D3B6']
                    }}
                    blockMargin={calendarParams.blockMargin}
                    blockSize={calendarParams.blockSize}
                    blockRadius={calendarParams.blockRadius}
                    maxLevel={4}
                    {...props}
                />
            </div>
        </div>
    )
}

interface Activity {
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
    total: {
        [year: number]: number
        [year: string]: number
    }
    contributions: Array<Activity>
}

interface ApiErrorResponse {
    error: string
}

export default GithubCalendar