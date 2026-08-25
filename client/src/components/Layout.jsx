import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function Layout({ auth }) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar auth={auth} />
            <div className="flex flex-1 flex-col">
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    <Outlet context={{ auth }} />
                </main>
                <MobileNav auth={auth} />
            </div>
        </div>
    );
}