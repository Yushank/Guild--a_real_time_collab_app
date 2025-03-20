"use client"

import { usePathname } from "next/navigation";
import { DashboardWrapper } from "./dashboardWrapper";


export default function ClientWrapper({children}: {children: React.ReactNode}){
    const pathname = usePathname();
    const hideOnRoute = ['/signup', '/signin'];
    const shouldHide = hideOnRoute.includes(pathname);

    return (
        shouldHide ? (
            <main>{children}</main>
        ) : (
            <DashboardWrapper>{children}</DashboardWrapper>
        )
    )
}