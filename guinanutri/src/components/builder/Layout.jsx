import React, { ReactNode } from 'react';

export default function Layout({ children }) {

    return (
        <div className="">
            <children />
        </div>
    )
}